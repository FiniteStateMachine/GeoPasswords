var PASSWORD = "123"; 
var timer; 
var coords = [];  

$(document).ready(function() {
    
	// Form events. 
    $("#submit").mouseenter( function(){
    	$(this).css({'border' : "1px solid #606060"}); 
    }); 

    $("#submit").mouseleave( function(){
    	$(this).css({'border' : "1px solid #C0C0C0"}); 
    }); 

    $("#start").click( function(){
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
        genPassword(); 
    }); 

    $("#recordLocation").on("click", function(e){
        getCoords(); 
    }); 
});

function genPassword(){
    var password = ""; 

    //TODO: Better password gen algorithm. 
    for(var i = 0; i < coords.length; i++){
        password += coords[i].latitude; 
        password += coords[i].longitude; 
    }

    $("#password").val(password);
}

function checkPassword(password){
	if(password === PASSWORD)
		swal("Good job!", "Password match.", "success")
	else
	    sweetAlert("Oops...", "Password did not match.", "error");
}

function startTimer(start){
    if(start)
        timer = setInterval(getCoords, 1000);
    else
        window.clearInterval(timer)
}

function getCoords(){
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

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

function savePosition(position) {
    var coord = { latitude : position.coords.latitude , longitude : position.coords.longitude }; 
    coords.push(coord); 
}

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