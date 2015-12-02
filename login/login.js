var PASSWORD = "123"; 

$(document).ready(function() {
    
	// Form events. 
    $("#submit").mouseenter( function(){
    	$(this).css({'border' : "1px solid #606060"}); 
    }); 

    $("#submit").mouseleave( function(){
    	$(this).css({'border' : "1px solid #C0C0C0"}); 
    }); 

    $("#start").click( function(){
    	$("#progress").show(); 
    }); 

    $("#end").click( function(){
    	$("#progress").hide(); 
    }); 

	$("#submit").on("click", function(e) {
	    e.preventDefault();

	    checkPassword($("#password").val()); 
	});
});


function checkPassword(password){
	if(password === PASSWORD)
		swal("Good job!", "Password match.", "success")
	else
	    sweetAlert("Oops...", "Password did not match.", "error");
}