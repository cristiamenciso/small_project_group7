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
		xhr.onreadystatechange = function () {
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

  let contactList = "";

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

        for (let i = 0; i < jsonResponse.results.length; i++) {
          let contact = jsonResponse.results[i];
          contactList += "First Name: " + contact.FirstName + "<br>";
          contactList += "Last Name: " + contact.LastName + "<br>";
          contactList += "ID: " + contact.ID + "<br>";
          contactList += "Phone: " + contact.Phone + "<br>";
          contactList += "Email: " + contact.Email + "<br><br>";
        }

        document.getElementById("contactList").innerHTML = contactList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}


