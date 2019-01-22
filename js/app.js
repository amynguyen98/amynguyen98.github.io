"use strict";

var navigationControl = function(the_link){
	/* manage the appearance of the navigation*/
	$(".mis2402navlink").parent("li").removeClass("active");
	/* remove the active class from all <li> parents */
	$(the_link).parent("li").addClass("active");
	/* add the active class to the_link anchor's <li> parent */
	
	/* manage the conent that is displayed */
	var idToShow = $(the_link).attr("href");
	
	/* hide all content-wrappers */
	$(".content-wrapper").hide();
	/* show the chosen content wrapper */
	$(idToShow).show();
	
	/* scroll to top of page */
	$("html, body").animate({ scrollTop: "0px" });
	
}

var pulsateThisTag = function(theTagSelector){
	$(theTagSelector).animate({"height": "+=10px", "width": "+=10px",});
    $(theTagSelector).animate({"height": "-=10px", "width": '-=10px',});
}

var refreshQuotes = function(){
	$.getJSON("https://misdemo.temple.edu/dailyquote/", function (a_gaggle_of_quotes ){
		var theQuote = a_gaggle_of_quotes[0]['quote'];  // a_gaggle_of_quotes is a simple object 
												   // think of it as an array.
												   // the dailyquote resource  
												   // always returns an array of length one.
		$("#quote_for_today").html(theQuote);
		
		var theAuthor = a_gaggle_of_quotes[0]['author'];
		
		$("#who_said_it").html(theAuthor);
	});
}

$(document).ready(function (){

    /* ------------------  basic navigation ----------------*/    
   
    /* this reveals the default page */
    $("#wrapperlogin").show();
    $("a[href='#wrapperlogin']").parent("li").addClass("active");
    
    /* this controls navigation - show / hide pages as needed */
    /* when a mis2402navlink is clicked */

    $(".mis2402navlink").click(function(){
		navigationControl(this);
        });
    
    /* ------------------  link 4 logic ----------------*/    
    /* this makes the "look at me" button pulsate */
    $("#look_at_me").hover(function(){
		pulsateThisTag("#look_at_me");
        });    

    /* ------------------  login link logic ----------------*/    
    
    /* whenever an input tag in wrapperlogin changes */
    $("#wrapperlogin input").change(function(){

        if ($("#idUsername").is(":valid") && $("#idPassword").is(":valid") ){
            $("#btnLoginContinue").removeAttr("disabled");
			pulsateThisTag("#btnLoginContinue");
        } else {
            $("#btnLoginContinue").attr("disabled", true);
        }
    });
    
    $("#btnLoginContinue").click(function(){
        alert("Login now!");
    });
	
	$.getJSON("https://misdemo.temple.edu/states/", function (a_bunch_of_states ){
		var theHTMLstring = '';
		for (var i = 0; i < a_bunch_of_states.length; i++) {
			theHTMLstring = '<option value = "' + a_bunch_of_states[i]['state'] +  '"  >' + a_bunch_of_states[i]['state_name']  + '</option>';
			$("#idYourstate").append(theHTMLstring);
		}
	});
	

    /* whenever an input tag in wrapperregister changes */
    $("#wrapperregister input").change(function(){

        if ($("#idFirstname").is(":valid") && $("#idLastname").is(":valid") &&  $("#idEmail").is(":valid") ){
            $("#btnRegisterContinue").removeAttr("disabled");
			pulsateThisTag("#btnRegisterContinue");
		} else {
            $("#btnRegisterContinue").attr("disabled", true);
        }
    });
    
    $("#btnRegisterContinue").click(function(){
        alert("Register now!");
    });

	
	/* ------------------  quote of the day logic -----------------------------------------------*/    
	/* on document ready go get the quote of the day.  Put it in the tag called #quote_for_today */
	
	refreshQuotes();

	/* When btnGetNewQuote is clicked, got get a new quote.  Put it in the tag called #quote_for_today */
	
	$("#btnGetNewQuote").click(function(){
		refreshQuotes();	
	});

	/* ------------------  change calculator logic -----------------------------------------------*/    
	//when the calculate button is clicked ...
	$("#calculate").click( function() {
        var cents, quarters, dimes, nickels, pennies;
    
        // get the number of cents from the user
        cents = Math.floor( parseInt( $("#cents").val() ) );

        if (isNaN(cents) || cents < 0 || cents > 99) {
            $("#my_message").html("Please enter a valid number between 0 and 99");
        } else {
            // calculate the number of quarters
            quarters = cents / 25;  // get number of quarters
            quarters = Math.floor(quarters);
            cents = cents % 25;         // assign the remainder to the cents variable

            // calculate the number of dimes
            dimes = cents / 10;     // get number of dimes
            dimes = Math.floor(dimes);
            cents = cents % 10;         // assign the remainder to the cents variable

            // calculate the number of nickels
            nickels = cents / 5;
            nickels = Math.floor(nickels);

            // calculate the number of nickels and pennies
            pennies = cents % 5;

            // display the results of the calculations
            $("#quarters").val( quarters );
            $("#dimes").val( dimes );
            $("#nickels").val( nickels );
            $("#pennies").val( pennies );
            
            // set focus on cents text box
            $("#cents").focus();
        }
    }); // end click() method

	/* ------------------  my friend logic -----------------------------------------------*/    
	/* When btn_friend_save is clicked validate the form.  Alert the user to any 
		trouble using the spans that are next to the input fields*/
	
	$("#btn_friend_save").click(function(){
		
		//trim all input
		$("#frm_myfriend input").each(function(){
			$(this).val($(this).val().trim());
		});
		
		//clear all error messages
		$("#frm_myfriend input").next('span').text('');
		
		//see if there any errors
		var bad_tags = $("#frm_myfriend input:invalid");
		
		if (bad_tags.length > 0){
			//some errors.  Report them.
			bad_tags.each(function(){
				var err_text = $(this).attr('title');
				$(this).next().text(err_text);
			});
		} else {
			//no errors. Whoopie!!
			$(this).next('span').text('Phone number saved.');
			$('#phone').val($('#friend_phone').val());
			$('#share_with_name').val($('#friend_name').val());			
		}
	}); // end friend save button

	$('#btnShareQuote').click(function(){
		
		//clear out any error messages
		$(this).next('span').text('');
		
		var the_phone = $("#phone").val();
		console.log(the_phone);
		
		if (the_phone == ""){
			$(this).next().text('Oops.  Before you can share this quote, you need to add a friend.  Click on "My Friend" and add a name and phone number.');
		} else {
			//move stuff around
			var the_message = "Hello, " + $("#share_with_name").val() + 
						".  I saw this quote and wanted to share it with you: " +
						$("#quote_for_today").text() + " - " +
						$("#who_said_it").text();
						
			$("#message").val(the_message);
			
			var serialized_data = $("#frm_quote_to_share").serialize();
			//send the message using $.post
			$.post('http://textbelt.com/text',serialized_data,function(reply){
				console.log(reply);
				if (reply["success"]){
					$("#btnShareQuote").next('span').next('span').text("Message sent!");
				} else {
					$("#btnShareQuote").next('span').text("Something went wrong. " + reply['error']);					
				};
			}); // end post
		}
	}); // end share quote button
	
	
    }); /* end the document ready event*/
