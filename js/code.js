const urlBase = 'http://COPPARADISE.CLUB/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function openAddContactModal() {
	document.getElementById("addContactModal").style.display = "flex";
}

function closeAddContactModal() {
	document.getElementById("addContactModal").style.display = "none";
}

function addContact() {
  let firstName = document.getElementById("firstNameInput").value;
  let lastName = document.getElementById("lastNameInput").value;
  let phone = document.getElementById("phoneInput").value;
  let email = document.getElementById("emailInput").value;

  document.getElementById("contactAddResult").innerHTML = "";

  // Regular expressions for phone number and email formats
  let phoneRegex = /^\d{10}$/; // Assumes 10-digit phone numbers
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    document.getElementById("contactAddResult").innerHTML = "Invalid phone number format. Please enter a 10-digit number.";
    return;
  }

  if (!emailRegex.test(email)) {
    document.getElementById("contactAddResult").innerHTML = "Invalid email format. Please enter a valid email address.";
    return;
  }

  let requestData = {
    firstname: firstName,
    lastname: lastName,
    phone: phone,
    email: email,
    userId: userId
  };
  let jsonPayload = JSON.stringify(requestData);

  let url = urlBase + '/AddContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactAddResult").innerHTML = "Contact has been added";
        closeAddContactModal();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}


function searchContacts() {
  let search = document.getElementById("searchText").value;
  document.getElementById("contactSearchResult").innerHTML = "";

  let requestData = {
    search: search,
    userId: userId,
  };
  let jsonPayload = JSON.stringify(requestData);

  let url = urlBase + '/SearchContacts.php';

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactSearchResult").innerHTML =
          "Contact(s) have been retrieved";
        let jsonResponse = JSON.parse(xhr.responseText);

        let contactList = "";
        for (let i = 0; i < jsonResponse.results.length; i++) {
          let contact = jsonResponse.results[i];
          contactList +=
            "<div class='contact' onclick='selectContact(event);' data-id='" +
            contact.ID +"'>" +
            "First Name: " +
            contact.FirstName +
            "<br>" +
            "Last Name: " +
            contact.LastName +
            "<br>" +
            "Phone: " +
            contact.Phone +
            "<br>" +
            "Email: " +
            contact.Email +
            "<br><br></div>";
        }

        document.getElementById("contactList").innerHTML = contactList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}


let selectedContactId = null;

function selectContact(event) {
  let previouslySelectedContact = document.querySelector(".contact.selected");
  if (previouslySelectedContact) {
    previouslySelectedContact.classList.remove("selected");
  }

  event.target.classList.add("selected");
}




function deleteSelectedContact() {
  let selectedContact = document.querySelector(".contact.selected");
  if (!selectedContact) {
    alert("Please select a contact to delete");
    return;
  }

  let contactId = selectedContact.getAttribute("data-id");

  // Add confirmation prompt
  let confirmation = confirm("Are you sure you want to delete this contact?");
  if (!confirmation) {
    return;
  }

  let jsonPayload = JSON.stringify({ contactId: contactId, userId: userId });

  let url = urlBase + '/DeleteContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Refresh your contacts list here
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    alert(err.message);
  }
}
function openRegisterModal() {
	document.getElementById("addRegisterModal").style.display = "flex";
}

function closeRegisterModal() {
	document.getElementById("addRegisterModal").style.display = "none";
}

function doRegister() {
	let username = document.getElementById("userIdInput").value;
	let firstName = document.getElementById("firstNameInput").value;
	let lastName = document.getElementById("lastNameInput").value;
	let password = document.getElementById("passwordInput").value;
	
	document.getElementById("registerAddResult").innerHTML = "";

	let tmp = {login:username, firstName:firstName, lastName:lastName, password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/RegisterUser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if(userId < 1)
				{		
					document.getElementById("registerAddResult").innerHTML = "Registration failed";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerAddResult").innerHTML = err.message;
	}
}
