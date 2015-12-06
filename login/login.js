var PASSWORD = ""; 
var timer; 
var coords = [];  
var coords_from_file = []; 

$(document).ready(function() {
    
	// Form events. 
  $("#submit").mouseenter( function(){
  	$(this).css({'border' : "1px solid #606060"}); 
  }); 

  $("#submit").mouseleave( function(){
  	$(this).css({'border' : "1px solid #C0C0C0"}); 
  }); 

  $("#start").click( function(){
    coords = []; 
    if($("#sel1")[0].selectedIndex == 0){
      startTimer(true); 
      $("#progress").show(); 
    }
    else{
      $("#recordLocation").show(); 
    }
  }); 

  $("#stop").click( function(){
    if($("#sel1")[0].selectedIndex == 0){
      startTimer(false); 
      $("#progress").hide(); 
      printCoords(); 
    }
    else{
      $("#progress").hide(); 
      $("#recordLocation").hide(); 
      printCoords(); 
    }
  }); 

	$("#submit").on("click", function(e) {
    e.preventDefault();
    checkPassword($("#password").val()); 
	});

  $("#genPassword").on("click", function(e) {
    genPassword(false); 
  }); 

  $("#recordLocation").on("click", function(e){
    getCoords(); 
  }); 

  $("#sel1").on("change", function(e) {
    $("#results").html(""); 
    $("#progress").hide(); 
    $("#password").val("");

    if($("#sel1")[0].selectedIndex == 2){
      swal("Password has been generated from a file."); 
      $("#buttons").hide(); 
      $("#results_container").hide(); 
      $("#genPassword_container").show(); 
    }
    else{
      $("#buttons").show(); 
      $("#results_container").show(); 
      $("#genPassword_container").hide(); 
    }
  });

  $("#setPassword").on("click", function(e){
    genPassword(true); 
  }); 

});

/*
 * Uses coords array to generate password. 
 */ 
function genPassword(set){
  var password = ""; 

  // If we are generating password from file (file contains lat and long coordinates)
  if($("#sel1")[0].selectedIndex == 2){
    for(var i = 0; i < coords_from_file.length; i++){
      password += coords_from_file[i].latitude; 
      password += coords_from_file[i].longitude; 
    }
  }
  // Otherwise from path. 
  // TODO: Better algorithm. 
  else{
    for(var i = 0; i < coords.length; i++){
      password += coords[i].latitude; 
      password += coords[i].longitude; 
    }
  }

  if(set)
    PASSWORD = password;
  else
    $("#password").val(password);
}

/*
 * Checks to see if your password matches PASSWORD
 */
function checkPassword(password){
	if(password === PASSWORD)
		swal("Good job!", "Password match.", "success")
	else
	    sweetAlert("Oops...", "Password did not match.", "error");
}

/*
 * Starts timer if param - start is true and stops timer otherwise. 
 * Timer callback every 1000 milliseconds or 1 second. 
 */
function startTimer(start){
  if(start)
      timer = setInterval(getCoords, 1000);
  else
      window.clearInterval(timer)
}

/*
 * Gets your current coordinates w/ high accuracy. 
 */
function getCoords(){
  if($("#sel1")[0].selectedIndex == 0)
    $("#progress").show(); 

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(savePosition, error, options);
  else {
      x.innerHTML = "Geolocation is not supported by this browser.";
      $("#progress").hide(); 
  }
}

/*
 * Error callback
 */ 
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

/*
 * Saves your current position to coords array
 */
function savePosition(position) {
  var coord = { latitude : position.coords.latitude , longitude : position.coords.longitude }; 
  coords.push(coord); 
}

/*
 * Prints out the coordinates. 
 */
function printCoords(){
  var coords_string = ""; 

  for(var i = 0; i < coords.length; i++){
      coords_string += "Lat: " + coords[i].latitude; 
      coords_string += " Long: " + coords[i].longitude;  
      coords_string += "<br/>"; 
  }

  $("#results_container").show(); 
  $("#results").html(coords_string); 
  $("#genPassword_container").show(); 
}

/* 
 * Reads coords from password.txt
 */ 
function readCoordsFromFile(){
  coords_from_file = []; 

  var oFrame = document.getElementById("frmFile");
  var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;

  while (strRawContents.indexOf("\r") >= 0)
    strRawContents = strRawContents.replace("\r", "");

  var arrLines = strRawContents.split("\n");
  
  for (var i = 0; i < arrLines.length; i++) {
    var line = arrLines[i];
    line = line.split(",");
    var lat = line[0]; 
    var lng = line[1]; 

    var coord = { latitude : lat, longitude : lng}; 
    coords_from_file.push(coord); 
  }
}
