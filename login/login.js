var PASSWORD = "123"; 
var timer; 
var coords = [];
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
	var c1 = { latitude : 0.0 , longitude : 0.0, heading: 90 };
	var c2 = { latitude : 1.0 , longitude : 0.0, heading: 0 };
	var testp = [];
	testp.push(c1);
	testp.push(c2);
	
	var c3 = { latitude : -1.0 , longitude : 1.0, heading: 0 };
	var c4 = { latitude : -1.0 , longitude : 2.0, heading: 0 };
	var attm = [];
	attm.push(c3);
	attm.push(c4);
	
	var attmt = translate(testp, attm);
	var attmtr = [];
	for(var i = 0; i < attmt.length; i++)
	{
		var pt = rotate(attmt[i], testp[0]["longitude"], testp[0]["latitude"], 90);
		attmtr.push(pt);
		alert(attmtr[i]["longitude"] + " " + attmtr[i]["latitude"]);
	}
	
	//var t = rotate(c2, c1["longitude"], c1["longitude"], 90);
	//alert(t["longitude"] + " " + t["latitude"]);
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
	var latitute = position.coords.latitude.toFixed(6);
	latitute = parseFloat(latitute);
	
	var longitude = position.coords.longitude.toFixed(6);
	longitude = parseFloat(longitude);
	
	var heading = position.coords.heading;
	
    var coord = { latitude : latitude , longitude : longitude, heading: heading }; 
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

function translate(p, input){
	var originX = p[0]["longitude"];
	var originY = p[0]["latitude"];
	var x = input[0]["longitude"];
	var y = input[0]["latitude"];
	var xt;
	var yt;
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
	
	for(var i = 0; i < input.length; i++)
	{
		input[i]["longitude"] += xt;
		input[i]["latitude"] += yt;
	}
	
	return input;
}

function rotate(coord, originX, originY, degree){
	var tempX = coord["longitude"];
	var tempY = coord["latitude"];
	var rad = degree * Math.PI / 180;
	
	var t1 = Math.cos(rad);
	var t2 = Math.sin(rad);
	
	var x = parseFloat(Math.cos(rad).toFixed(15)) * (tempX - originX) - parseFloat(Math.sin(rad).toFixed(15)) * (tempY - originY) + originX;
	var y = parseFloat(Math.sin(rad).toFixed(15)) * (tempX - originX) + parseFloat(Math.cos(rad).toFixed(15)) * (tempY - originY) + originY;
	
	var point = {
		longitude: x,
		latitude: y
		};
		
	return point;
}

function checkPass(attempt){
	for(var i = 0; i < pass.length; i++)
	{
		if(!((pass[i]["longitude"] - 0.0005) < attempt[i]["longitude"] && (pass[i]["longitude"] + 0.0005) > attempt[i]["longitude"] &&
		   (pass[i]["latitude"] - 0.0005) < attempt[i]["latitude"] && (pass[i]["latitude"] + 0.0005) > attempt[i]["latitude"]))
		   {
				
		   }
	}
}