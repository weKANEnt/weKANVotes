document.addEventListener(
  "DOMContentLoaded",
  function () {
    console.log("loaded page");

    /** Navbar buttons */
    var navCandidates = document.getElementById("navCandidates");
    var navResults = document.getElementById("navResults");
    var navSignIn = document.getElementById("navSignIn");
    var navBarLogo = document.getElementById("navBarLogo");
    var getOTPButton = document.getElementById("getOTPButton");
    var otpSignUp = document.getElementById("otpTextbox");
    var submitOTPButton = document.getElementById("submitOTP");
    var errorMessage = document.getElementById("errorMessage");
    var errorMessageAdmin = document.getElementById("errorMessageAdmin");
    var logInButton = document.getElementById("logInButton"); //for admin
    var password = document.getElementById("password"); //for admin
    var adminEmail = document.getElementById("adminEmail"); //for admin
    var createElection = document.getElementById("createElectionButton"); //for admin
    
    //var email = document.getElementById("email");

    var page1 = document.getElementById("page1Link");
    var page2 = document.getElementById("page2Link");
    



    /**Button Listeners*/
    
    /**Pages*/
    //Candidates
    if (navCandidates != null){ 
      navCandidates.addEventListener("click", function(){
        console.log("You clicked Candidates");
        window.location.href = '../view/candidates.html';
 
     });
    } 

    //Sign In
    if (navResults != null){
      navResults.addEventListener("click", function(){
        console.log("You clicked Results");
        window.location.href = '../view/results.html';
        //.setAttribute('href', '../view/results.html');
  
     });
    }

    //Sign In
    if (navSignIn != null){
      navSignIn.addEventListener("click", function(){
        console.log("You clicked Sign In");
        window.location.href = '../view/logIn.html';
        //.setAttribute('href', '../view/logIn.html');
 
     });
    }

    //Bar Logo
    if (navBarLogo != null){
      navBarLogo.addEventListener("click", function(){
        console.log("You clicked Home/Logo");
        window.location.href = '../view/index.html';
        //.setAttribute('href', '../view/index.html');
 
     });
    }

    /**Buttons */

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    var requestOptions2 = {
      method: "PATCH",
      redirect: "follow",
    };

    var requestOptions3 = {
      method: "POST",
      redirect: "follow",
    };
 
      

      
    //Home/Index Form Submit
    /**Redirect to logIn page upon sucessful email verification */
    /*COMPLETE*/
    var verifyEmail = "false"; //i should make this boolean
    var verifyOTP = "false";
    let email = ""; 
    if (getOTPButton != null){    
        getOTPButton.addEventListener("click", function(event){
                event.preventDefault();
                if (document.getElementById("email").value != null || document.getElementById("email").value != " " || document.getElementById("email").value != ""){
                    //naomi.benjamin@mymona.uwi.edu
                    //kayvia.harriott@mymona.uwi.edu
                    
                   fetch("https://wekan-api.herokuapp.com/uwivotes/votes?email=" + document.getElementById("email").value, requestOptions)

                   //localStorage.setItem("someVarKey", email);  
                   
                  
                   
                   .then((response) => response.json())
                    .then((result) => {
                        verifyEmail = result.success;
                        email = document.getElementById("email").value;
                        if (verifyEmail == true){  
                          localStorage.setItem("email", document.getElementById("email").value);
                          //email = localStorage.getItem("email");
                          //alert(email);
                           
                            fetch('https://wekan-api.herokuapp.com/uwivotes/votes/OTP',{
                            method: 'PATCH',
                            body: JSON.stringify({
                              "email": localStorage.getItem("email"),
                            }),
                            headers: {
                              'Content-type': 'application/json; charset=UTF-8',
                              },
                            })
                            .then((response) => {response.json()
                             
                              verifyEmail = "false";
                              window.location.href = '../view/logIn.html';
                              
                            })
                            .then((json) => console.log(json));
                          
                        } 
                        else {
                          
                          errorMessage.innerHTML = "*Please ensure a valid UWI email is entered.";
                        }
                    }
                        )
                    .catch((error) => console.log("error", error)); 

                    
                  }
                
                console.log(verifyEmail);
            });
    }

    /**Redirect to vote page upon sucessful otp verification */
    /**COMPLETE */
    if (submitOTPButton != null){
        if (localStorage.getItem("email")!=null){
          document.getElementById("email").value = localStorage.getItem("email");
        }
        submitOTPButton.addEventListener("click", function(event){
            event.preventDefault();
            
            //should add more criterio for otp not being empty
            if (otpSignUp.value.length != 0){ 
                  //to do: email not saving from previous page
                 // fetch("https://wekan-api.herokuapp.com/uwivotes/votes/OTP?otp=" + otpSignUp.value + "&email=" + "kayvia.harriott@mymona.uwi.edu", requestOptions)
               //alert(localStorage.getItem("email"));
                    fetch("https://wekan-api.herokuapp.com/uwivotes/votes/OTP?otp=" + otpSignUp.value + "&email=" + localStorage.getItem("email"), requestOptions)

                  .then((response) => response.json())
                  .then((result) => {
                        //alert(otpSignUp.value);
                        verifyOTP = result.success;
                        console.log(otpSignUp.value)
                        if (verifyOTP == true){
                            console.log("OTP verified");
                            //redirect to place vote
                            verifyOTP = "false";
                            window.location.href = '../view/voteIntroPage.html';
                        }
                        else{
                            console.log("OTP didn't work");
                        }
                  }
                      )
                  .catch((error) => console.log("error", error)); 

            }
            else{
              errorMessage.innerHTML = "*Please ensure an OTP is entered.";
            }
        });
    }


    /**Allow User to vote */




 


    /**Redirect to admin side upon succesfull admin verification */
    var verifyAdminEmail = ""; //should be boolean false
    if (adminEmail && password != null){
        logInButton.addEventListener("click", function(event){
            event.preventDefault();

            if (adminEmail.value != null && adminEmail.value != " " && adminEmail.value != "" && adminEmail.value.length != 0
                && password.value != null && password.value != " " && password.value != "" && password.value.length != 0){
                console.log("Checking if Admin email valid");

                fetch('https://wekan-api.herokuapp.com/uwivotes/admin/login', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  'email': adminEmail.value,
                  "password": password.value})
              }).then(res => res.json())
                .then(res => {
                  
                  if (res.success == true){
                      window.location.href = '../view/adminIndex.html';
                  }
                  else {
                    errorMessageAdmin.innerHTML = "*Please ensure an email and password is entered.";

                  }



                })
                






            }
            else{
              errorMessageAdmin.innerHTML = "*Please ensure an email and password is entered.";
            }

          


        });
    }
  

    if (createElection != null){
      createElection.addEventListener("click", function(event){
        event.preventDefault();
        window.location.href = '../view/createElection.html';
      })
    }




    /**Helper Functions */
    function disableLink(linkName){
      //alert("Link off")
      linkName.getElementById(id).style.visibility = "hidden";
      //disable link
    }

    function enableLink(linkName){
      //alert("Link on")
      linkName.getElementById(id).style.visibility = "visible";
      //re-enable link
    }

    






    /**Else */

    /**Verify email address format */



    /**Redirect to OTP page once email verified
     */









/*
    fetch('https://wekan-api.herokuapp.com/uwivotes/ballot/vpssp')
                .then(function(response) {
                    return result.candidates
                    

                }).then(function(body) {
                    document.body.innerHTML += body
                })*/

/*
                fetch('../view/page1.html')
              .then(function(response) {
                    return response.json()
        }).then(function(body) {
         body
        })   */

        /** //finnnalllll 
    console.log("page loads");
var requestOptions = {
        method: "GET",
        redirect: "follow",
        };
        fetch("https://wekan-api.herokuapp.com/uwivotes/ballot/vpssp", requestOptions)
        .then((response) => response.json())
        .then((result) => document.body.innerHTML += result.candidates[0].firstName)
        .catch((error) => console.log("error", error));*/


     /*     fetch('../view/page1.html')
        .then(function(response) {
        return response.text()
      }).then(function(body) {
        document.body.innerHTML = body
      })*/


        
   /* if (page1 != null){
        page1.addEventListener("click", function(){
            //page2.setAttribute('href', '');
            

        })
    }*/



  },
  false
);
