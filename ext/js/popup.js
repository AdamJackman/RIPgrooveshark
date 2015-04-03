window.onload = function(){ 
	// OnLoad setup
     document.getElementById("findBut").onclick = findDiffExec; 
     document.getElementById("saveBut").onclick = saveListsExec; 
};

//Keeping these seperate as I anticipate another step
function findDiffExec(){
	auth('find');
}
function saveListsExec(){
	auth('save');
}

function findDiff(){
	//Send an ajax request in order to start the find functionality
	$.ajax({
		type: 'GET',
		url: "http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?jsoncallback=?",
		timeout: 0,
		data: {
			"type": "find"
		},
		success: function(response){
			//Here is where you would really like to show the difference to the user
			if(response){
				var res = JSON.parse(response);	
				displayMissing(res);
			}
			

		},
		error: function(){
		}
	});
}

function displayMissing(res){
	//Create the div to show all the missing in
	var missingBox = document.createElement('div');
	missingBox.setAttribute('id', "missingBox");
	//add a label
	var missingLabel = document.createElement('label');
	missingLabel.setAttribute('class', 'mainMissLabel');
	missingLabel.innerHTML = 'Missing Songs';
	missingBox.appendChild(missingLabel);

	var i;
	for (i=0; i<res.length; i++){
		//create the Div
		var missingDiv = document.createElement('div');				
		missingDiv.setAttribute('class', 'missItem');
		//create the labels
		var songLabel = document.createElement('label');
		songLabel.setAttribute('class', 'missSong');
		songLabel.innerHTML = res[i]['songName'];
		var artistLabel = document.createElement('label');
		artistLabel.innerHTML = " By: " + res[i]['artistName']
		//add Labels to Div and Div to the main
		missingDiv.appendChild(songLabel);
		missingDiv.appendChild(artistLabel);
		missingBox.appendChild(missingDiv);
	}

	//add a button to get rid of text
	var remBut = document.createElement('button');
	remBut.setAttribute('id', 'noteBut2');
	remBut.setAttribute('class', 'btn btn-info pull-right');
	remBut.setAttribute('type', 'button');
	remBut.innerHTML = "Done";
	remBut.onclick = function(){
		$('#missingBox').remove();
	}
	missingBox.appendChild(remBut);

	//add the missingBox onto the main html
	$('body').append(missingBox);
}

function saveLists(){
	//send an ajax request in order to start the save functioality
	$.ajax({
		type: 'GET',
		url: "http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?jsoncallback=?",
		timeout: 0,
		data: {
			"type": "save"
		},
		success: function(response){
			notifyMessage("Successfully saved your playlists");
		},
		error: function(){
		}
	});

}

function auth(type){
	//look for a logged response
	$.ajax({
		type: 'GET',
		url: "http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?jsoncallback=?",
		timeout: 0,
		data: {
			"type": "init"
		},
		success: function(response){
			if(response == 'logged'){
				//call the function
				if (type == 'find'){
					findDiff();
				}
				else if (type == 'save'){
					saveLists();
				}
				else{
					alert("I don't know how you got here, but I'm impressed");
				}
			}
			else{
				//Its log in time
				newwindow = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");			
			}
		}
	});
}

function notifyMessage(msg){

	var alertDiv = document.createElement('div');
	alertDiv.setAttribute('id', "alerterDiv");
	alertDiv.setAttribute('class', "alerter");
	$('body').append(alertDiv);

	var alertLabel = document.createElement('label');
	alertLabel.setAttribute('id', "alertLabel");
	alertLabel.innerHTML = msg;
	alertDiv.appendChild(alertLabel);

	var alertBut = document.createElement('button');
	alertBut.setAttribute('id', 'noteBut');
	alertBut.setAttribute('class', 'btn btn-info pull-right');
	alertBut.setAttribute('type', 'button');
	alertBut.innerHTML = "Ok";
	alertBut.onclick = function(){
		$('#alerterDiv').remove();
	}
	alertDiv.appendChild(alertBut);

}