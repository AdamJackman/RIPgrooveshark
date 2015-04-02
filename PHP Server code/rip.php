<?php
//Set up the Grooveshark API connection
session_start();
require("gsAPI.php");
$gs = new gsAPI("withheld", "withheld"); //note: you can also change the default key/secret in gsAPI.php
$user = null;
if (!empty($_SESSION['gsSessionID'])) {
    //since we already have the gsSessionID lets restore that and see if were logged in already to Grooveshark
    $gs->setSession($_SESSION['gsSessionID']);
    if (!empty($_GET['token'])) {
	
        //We need the token to as authentication for grooveshark
        $user = $gs->authenticateToken($_GET['token']);
    } else {
	//populate user information 
        $user = $gs->getUserInfo();
    }
    if (empty($user['UserID'])) {
        //not logged in
        $user = null;
    }
} else {
    //since we didn't already have a gsSessionID, start one with Grooveshark and store it  
    $sessionID = $gs->startSession();
    if (empty($sessionID)) {
        exit;
    }
    $_SESSION['gsSessionID'] = $sessionID;
}
//if were already logged in then $user would not be null, and so don't authenticate
if (is_null($user)) {
    //user is not logged in so we must redirect to Grooveshark to get a token to authenticate the user
    //the auth page will ask for the user to approve your app and give permission, upon approval, it'll redirect back
    header("Location: https://grooveshark.com/auth/?app=withheld&callback=withheld", true, 307);
    exit;
}


//I think using a database is going to be the best method
//Connect to the database
//These are the database parameters for use
$dsn = 'withheld';
$username = 'withheld';
$password = 'withheld';


//PDO METHOD
try {
    $dbh = new PDO($dsn, $username, $password);
    //$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}

//----------//----------//----------//----------//Add the main here//----------//----------//----------//----------//----------

$playlists = $gs->getUserPlaylists();
if (!is_array($playlists)) {
    //something failed.
    exit;
}

//Use these functions based on the call made, function parameter is probably a good idea

//savePlaylists($gs, $dbh, $playlists, $user);
findDifference($gs, $dbh, $playlists, $user);

//----------//----------//----------//----------//----------//----------//----------//----------//----------//----------

// This function will save all the playlists given as an argument
function savePlaylists($gs, $dbh, $playlists, $user){
	//For Each Playlist Save
	foreach ($playlists as $playlist) {
	    //woring method for getting song information
	    $songs = $gs->getPlaylistSongs($playlist['PlaylistID']);
	    //For Each Song insert into the database
	    foreach ($songs as $song){
		//Insert each song into the database
			if($dbh){
		        $stmt = $dbh->prepare("INSERT INTO songstore (playlist, userid, songname, artistname) VALUES (?, ?, ?, ?)");
		        $stmt->bindParam(1, iconv('Windows-1252', 'UTF-8', $playlist['PlaylistID']));
		        $stmt->bindParam(2, iconv('Windows-1252', 'UTF-8', $user['UserID']));
		        $stmt->bindParam(3, iconv('Windows-1252', 'UTF-8', $song['SongName']));
		        $stmt->bindParam(4, iconv('Windows-1252', 'UTF-8', $song['ArtistName']));
		        $stmt->execute();
			}
	    }
	}
}

function findDifference($gs, $dbh, $playlists, $user){
	//For each of the playlists I want to check that each of the entries in the database is present
	foreach ($playlists as $playlist) {
	
	//Gather the information from the database
	$id= $user['UserID'];
	$playlistid= $playlist['PlaylistID'];
        //Prepared statement for the query
        $sql = 'SELECT *
            FROM songstore
            WHERE playlist= :playlist AND userid = :userid';
        $sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $sth->execute(array(':playlist' => $playlistid, ':userid' => $id));
        $res = $sth->fetchAll();

	 //Case that a playlist  exists
        if($res){
		//Grab the playlist songs
		$songs = $gs->getPlaylistSongs($playlist['PlaylistID']);	
                foreach ($res as $row) {
			//Gather the information of the song
			$seekSong = $row['songname'];
			$seekArtist = $row['artistname'];
			$found = false;
			//verify the song is still in the listing here
			
        		foreach ($songs as $song){
					if(iconv('Windows-1252', 'UTF-8', $song['SongName']) ==  $seekSong 
						and iconv('Windows-1252', 'UTF-8', $song['ArtistName']) ==  $seekArtist){
						//Perhaps remove the song from the array
						//Unsetting should improve efficiency, must check first though
						unset($songs[$song]);
						$found = true;
						break; 
					}
				}

				if(!$found){
					//Here is the failing case for a song so output the information to the user
					echo 'Missing Song Found:  ' .  $seekSong . " By: " . $seekArtist;	
				}	
            }
        }
	}

}



?>
