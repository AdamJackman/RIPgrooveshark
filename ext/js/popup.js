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
	//newwindow = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");
	$.ajax({
		type: 'GET',
		url: "http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?jsoncallback=?",
		timeout: 0,
		data: {
			"type": "find"
		},
		success: function(response){
			alert("Success");
			alert(response);
		},
		error: function(){
		}
	});
}

function saveLists(){
	//send an ajax request in order to start the save functioality
	//newwindow = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");
	//newwindow2 = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");
		$.ajax({
		type: 'GET',
		url: "http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?jsoncallback=?",
		timeout: 0,
		data: {
			"type": "save"
		},
		success: function(response){
			alert("Success");
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
				alert("logged spotted");
				if (type == 'find'){
					findDiff();
				}
				else if (type == 'save'){
					saveLists();
				}
				else{
					alert("something terrible has happened");
				}
			}
			else{
				//Its log in time
				newwindow = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");			
			}
		}
	});
}