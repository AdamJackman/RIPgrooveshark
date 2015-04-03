window.onload = function(){ 
	// OnLoad setup
     document.getElementById("findBut").onclick = findDiff; 
     document.getElementById("saveBut").onclick = saveLists; 
};

function findDiff(){
	//Send an ajax request in order to start the find functionality
	//newwindow = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");
	auth();

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
	auth();

		$.ajax({
		type: 'GET',
		url: "http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?jsoncallback=?",
		timeout: 0,
		data: {
			"type": "save"
		},
		success: function(response){
			alert("Success");
			alert(response);
			newwindow.close();
		},
		error: function(){
		}
	});

}

function auth(){
	

	newwindow = window.open("http://ec2-52-0-6-182.compute-1.amazonaws.com/rip.php?type=init", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=500, height=500, top=10, left=10");

}