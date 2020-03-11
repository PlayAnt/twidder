displayView = function(){
  // the code required to display a view
};

window.onload = function(){



  if(sessionStorage.getItem('token') != null){
    //var exampleSocket = new WebSocket("ws://127.0.0.1:5000/socket");
    var exampleSocket = new WebSocket("wss://twidder789.herokuapp.com/socket");
    exampleSocket.onopen = function (event) {
      console.log("Opened Socket!");
      exampleSocket.send(sessionStorage.getItem('token'));
    };

    exampleSocket.onmessage = function (event) {
      console.log("Message Received!", event.data);
      forcedSignOut();
    };

    exampleSocket.onclose = function(event) {
      console.log("Websocket Closed");
    }

    loadInf();
    document.getElementById("view1").innerHTML = document.getElementById("profileview").innerHTML;
    document.getElementById("defaultTab").click();
    loadBrowse();
    document.getElementById("browsedUser").style.display = "none";
  }
  else{
    document.getElementById("view1").innerHTML = document.getElementById("welcomeview").innerHTML;
  }
};

function SignInValidation(){

  email = document.getElementById("signInEmail").value,
  password = document.getElementById("signInPassword").value

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", '/signin');
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
      var returned = JSON.parse(this.responseText)
      if(returned.success == "false"){
        document.getElementById("ErrorSignin").innerHTML = "<font size='2' color ='red'>" + returned.message + "</font>";
        return 0;
      }
      if(returned.success == "true"){
        //var exampleSocket = new WebSocket("ws://127.0.0.1:5000/socket");
        var exampleSocket = new WebSocket("wss://twidder789.herokuapp.com/socket");

        exampleSocket.onopen = function (event) {
          console.log("Opened Socket!");
          exampleSocket.send(returned.token);
        };

        exampleSocket.onmessage = function (event) {
          console.log("Message Received!", event.data);
          forcedSignOut();
        };

        exampleSocket.onclose = function(event) {
          console.log("Websocket Closed");
        }

        sessionStorage.setItem('token', returned.token)
        loadInf();

        document.getElementById('view1').innerHTML = document.getElementById('profileview').innerHTML;

        document.getElementById("defaultTab").click();
        loadBrowse();
        document.getElementById("browsedUser").style.display = "none";
        return 1;
      }
    }
  }
  xmlhttp.send(JSON.stringify({"email": email, "password": password}));
  return 0;
};

function SignUpValidation(){

  var x = document.getElementById("passw");
  var y = document.getElementById("passw_rpt");

  if(x.value != y.value) {
    document.getElementById("ErrorSignup").innerHTML = "<font size='2' color='red'> Passwords doesn't match! </font>";
    return 0;
  }
  // x = the choice of selected gender in a string

  var x = document.getElementById('signupform').elements['gender_options'].value;
  if(x == 'error'){
    document.getElementById("ErrorSignup").innerHTML = "<font size='2' color ='red'> Please choose gender </font>";
    return 0;
  }

  var userdata = {
    email: document.getElementById('userEmail').value,
    password: y.value,
    firstname: document.getElementById('userFirstName').value,
    familyname: document.getElementById('userFamilyName').value,
    gender: x,
    city: document.getElementById('userCity').value,
    country: document.getElementById('userCountry').value
  };

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", '/signup');
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
      var returned = JSON.parse(this.responseText)
      if(returned.success == "false"){
        document.getElementById("ErrorSignup").innerHTML = "<font size='2' color ='red'>" + returned.message + "</font>";
        return 0;
      }
      if(returned.success == "true"){
        document.getElementById("ErrorSignup").innerHTML = "<font size='2' color ='green'>" + returned.message + "</font>";
        return 1;
      }
    }
  }

  xmlhttp.send(JSON.stringify({
    "email": userdata.email,
    "password": userdata.password,
    "firstName": userdata.firstname,
    "familyName": userdata.familyname,
    "gender": userdata.gender,
    "city": userdata.city,
    "country": userdata.country}));

    return 0;
    // }
  };

  function changePasswordValidation(){
    var x = document.getElementById("changePasswordCurrent").value;
    var y = document.getElementById("changePassword").value;
    var z = document.getElementById("changePasswordConfirm").value;

    if(y != z) {
      document.getElementById("changePasswordError").innerHTML = "<font size='2' color='red'> Passwords doesn't match! </font>";
      return 0;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", '/changePassword');
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        document.getElementById('changePasswordCurrent').value = '';
        document.getElementById('changePassword').value = '';
        document.getElementById('changePasswordConfirm').value = '';
        document.getElementById('changePasswordError').innerHTML = returned.message;
        return 1;
      }
    }

    xmlhttp.send(JSON.stringify({"oldPassword": x, "newPassword": z}));
    return 0;

  }

  function forcedSignOut(){
  //  if (sessionStorage.getItem('token') != null){
      document.getElementById("view1").innerHTML = document.getElementById("welcomeview").innerHTML;
      sessionStorage.clear();
      return 0;
    // }
    // else{
    //   return 0;
    // }
  }

  function signOutValidation(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/signout');
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          return 0;
        }
        if(returned.success == "true"){
          sessionStorage.clear();
          document.getElementById("view1").innerHTML = document.getElementById("welcomeview").innerHTML;
          return 1;
        }
      }
    }
    xmlhttp.send();
    return 0;
  }

  function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function loadInf(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/getUserDataByToken');
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          //WADDUP
          return 0;
        }
        if(returned.success == "true"){
          document.getElementById('homeInfoEmail').innerHTML = returned.data.email;
          document.getElementById('homeInfoFirstname').innerHTML = returned.data.firstName;
          document.getElementById('homeInfoFamilyname').innerHTML = returned.data.familyName;
          document.getElementById('homeInfoGender').innerHTML = returned.data.gender;
          document.getElementById('homeInfoCity').innerHTML = returned.data.city;
          document.getElementById('homeInfoCountry').innerHTML = returned.data.country;
          return 1;
        }
      }
    }
    xmlhttp.send();
    return 0;
  }

  function loadBrowsedInf(email){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/getUserDataByEmail/' + email);
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          //WADDUP
          return 0;
        }
        if(returned.success == "true"){
          document.getElementById('bInfoEmail').innerHTML = returned.data.email;
          document.getElementById('bInfoFirstname').innerHTML = returned.data.firstName;
          document.getElementById('bInfoFamilyname').innerHTML = returned.data.familyName;
          document.getElementById('bInfoGender').innerHTML = returned.data.gender;
          document.getElementById('bInfoCity').innerHTML = returned.data.city;
          document.getElementById('bInfoCountry').innerHTML = returned.data.country;
          return 1;
        }
      }
    }
    xmlhttp.send();
    return 0;
  }

  function loadBrowse(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/getUserMessagesByToken');
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          //WADDUP
          return 0;
        }
        if(returned.success == "true"){
          document.getElementById('homeBrowseMessages').innerHTML = '';
          for(i= 0; i<returned.data.length; i++){
            document.getElementById('homeBrowseMessages').innerHTML += "<div class='message'>" + 'Author '+ returned.data[i].sender + ': ' + '\n' + returned.data[i].message + "</div>"
          }
          return 1;
        }
      }
    }
    xmlhttp.send();
    return 0;

  }
  function loadBrowseMessage(){
    email = document.getElementById('browseSearch').value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/getUserMessagesByEmail/' + email);
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));


    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          //WADDUP
          return 0;
        }
        if(returned.success == "true"){
          document.getElementById('BBrowseMessages').innerHTML = '';
          for(i= 0; i<returned.data.length; i++){
            document.getElementById('BBrowseMessages').innerHTML += "<div class='message'>" + 'Author '+ returned.data[i].sender + ': ' + '\n' + returned.data[i].message + "</div>"
          }
          return 1;
        }
      }
    }
    xmlhttp.send();
    return 0;
  }

  function postItMessage(){
    if(document.getElementById('homeMessageEmail').value != ''){
      if(document.getElementById('homeMessageTextArea').value != ''){
        message = document.getElementById('homeMessageTextArea').value;
        email = document.getElementById('homeMessageEmail').value;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", '/postMessage');
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

        xmlhttp.onreadystatechange = function() {
          if(this.readyState == 4 && this.status == 200){
            var returned = JSON.parse(this.responseText)
            if(returned.success == "false"){
              //WADDUP
              return 0;
            }
            if(returned.success == "true"){
              document.getElementById('homeMessageTextArea').value = '';
              document.getElementById('homeMessageEmail').value = '';
              loadBrowse();
              return 1;
            }
          }
        }
        xmlhttp.send(JSON.stringify({"email": email, "message": message}));
        return 0;
      }
    }
  }

  function searchUser(){
    document.getElementById('browseUser').innerHTML = "";
    email = document.getElementById('browseSearch').value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/getUserDataByEmail/' + email);
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          document.getElementById('browseUser').innerHTML = "<font size='2' color ='red'>" + returned.message + "</font>";
          return 0;
        }
        if(returned.success == "true"){
          loadBrowsedInf(document.getElementById('browseSearch').value);
          loadBrowseMessage();
          document.getElementById("browsedUser").style.display = "block";
          return 1;
        }
      }
    }

    xmlhttp.send();
    return 0;
  }

  function bPostItMessage(){
    message = document.getElementById('browseMessageTextArea').value;
    email = document.getElementById('bInfoEmail').innerHTML;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", '/postMessage');
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('token'));

    xmlhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var returned = JSON.parse(this.responseText)
        if(returned.success == "false"){
          //WADDUP
          return 0;
        }
        if(returned.success == "true"){
          document.getElementById('browseMessageTextArea').value = '';
          loadBrowseMessage();
          return 1;
        }
      }
    }
    xmlhttp.send(JSON.stringify({"email": email, "message": message}));
    return 0;

  }
