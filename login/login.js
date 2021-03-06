var PASSWORD = ""; 
var timer; 
var coords = [];  
var coords_from_file = []; 
var pass = [];  

$(document).ready(function() {
    
	// Form events. 
  $("#submit").mouseenter( function(){
  	$(this).css({'border' : "1px solid #606060"}); 
  }); 

  $("#submit").mouseleave( function(){
  	$(this).css({'border' : "1px solid #C0C0C0"}); 
  }); 

  $("#start").click( function(){
    $("#results").html(""); 
    $("#password").val("");
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
    }
    else{
      $("#progress").hide(); 
      $("#recordLocation").hide(); 
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
      $("#enterPassword_container").show(); 
    }
    else{
      $("#buttons").show(); 
      $("#results_container").show(); 
      $("#genPassword_container").hide(); 
      $("#enterPassword_container").hide(); 
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
  else{
    for(var i = 0; i < coords.length; i++){
      password += "" + coords[i].latitude; 
      password += "" + coords[i].longitude; 
      password += "" + coords[i].heading; 
    }
  }

  if(set){
    if($("#sel1")[0].selectedIndex == 2)
      PASSWORD = password;
    else
      pass = coords; 
  }
  else
    $("#password").val(password);
}

/*
 * Checks to see if your password matches PASSWORD
 */
function checkPassword(password){
  if($("#sel1")[0].selectedIndex == 2){
  	if(password === PASSWORD)
  		swal("Good job!", "Password match.", "success")
  	else
  	    sweetAlert("Oops...", "Password did not match.", "error");
  }
  else
  {
	//Translates the password attempt
    var attemptt = translate(pass, coords); 
    var passHeading = pass[0]["heading"]; 
    var coorHeading = coords[0]["heading"]; 
    var rotateDegree = passHeading - coorHeading; 
    var attempttr = []; 

	//Rotates the password attempt
    for(var i = 0; i < attemptt.length; i++)
    {
      var pt = rotate(attemptt[i], pass[0]["longitude"], pass[0]["latitude"], rotateDegree);
      attempttr.push(pt);
    }

	//Checks if the attempt matches the password
    if(checkPasswordHelper(attempttr))
      swal("Good job!", "Password match.", "success")
    else
      sweetAlert("Oops...", "Password did not match.", "error");

  }
}

/*
 * Check password helper function. 
 */ 
function checkPasswordHelper(attempt){
  verified = true; 
  //Threshold value to accept a password attempt
  var range = 0.00005; 

  for(var i = 0; i < pass.length; i++)
  {
    if(!((pass[i]["longitude"] - range) < attempt[i]["longitude"] && (pass[i]["longitude"] + range) > attempt[i]["longitude"] &&
       (pass[i]["latitude"] - range) < attempt[i]["latitude"] && (pass[i]["latitude"] + range) > attempt[i]["latitude"]))
       {
        verified = false; 
       }
  }
  return verified; 
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
	var latitude = position.coords.latitude.toFixed(6);
	latitude = parseFloat(latitude);
	
	var longitude = position.coords.longitude.toFixed(6);
	longitude = parseFloat(longitude);
	
	var heading = position.coords.heading;
  if (heading == null){
    heading = 0;
  }
	
  var coord = { latitude : latitude , longitude : longitude, heading: heading }; 
  coords.push(coord); 

  //print coord
  $("#results_container").show(); 
  $("#genPassword_container").show(); 
  $("#enterPassword_container").show(); 

  var coords_string = "Lat: " + coord.latitude; 
  coords_string += " Long: " + coord.longitude; 
  coords_string += " Heading: " + coord.heading; 
  coords_string += "<br/>"; 

  var _html = $("#results").html(); 
  _html += coords_string; 
  $("#results").html(_html); 
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
  $("#enterPassword_container").show(); 
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

//Translates the input array of longitude/latitude points
//in respect to an origin point x and y
function translate(p, input){
	var originX = p[0]["longitude"];
	var originY = p[0]["latitude"];
	var x = input[0]["longitude"];
	var y = input[0]["latitude"];
	var xt;
	var yt;
	
	//Calculates the x and y distances to be translated
	//based on the origin x and y point
	if(x > originX)
	{
		xt = -(x - originX);
	}
	else
	{
		xt = (originX - x);
	}
	if(y > originY)
	{
		yt = -(y - originY);
	}
	else
	{
		yt = (originY - y);
	}
	
	//Translates the input array with the calculated
	//xt and yt distances
	for(var i = 0; i < input.length; i++)
	{
		input[i]["longitude"] += xt;
		input[i]["latitude"] += yt;
	}
	
	return input;
}

//Rotates a longitude/latitude point in respect to an
//origin point x, y and a specified degree
function rotate(coord, originX, originY, degree){
	var tempX = coord["longitude"];
	var tempY = coord["latitude"];
	var rad = degree * Math.PI / 180;
	
	//test variables
	//var t1 = Math.cos(rad);
	//var t2 = Math.sin(rad);
	
	//Calculates the newly rotated x and y point
	var x = parseFloat(Math.cos(rad).toFixed(15)) * (tempX - originX) - parseFloat(Math.sin(rad).toFixed(15)) * (tempY - originY) + originX;
	var y = parseFloat(Math.sin(rad).toFixed(15)) * (tempX - originX) + parseFloat(Math.cos(rad).toFixed(15)) * (tempY - originY) + originY;
	
	var point = {
		longitude: x,
		latitude: y
	};
		
	return point;
}
