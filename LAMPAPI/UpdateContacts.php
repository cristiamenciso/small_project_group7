<?php
	$inData = getRequestInfo();
	
	//Gathering the info needed about our contact to be updated from the users end
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$emailAddress = $inData["emailAddress"];
	$UserId = $inData["UserId"];

	//Connecting to the database
	$conn = new mysqli("localhost", "controller", "controlpass", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//Updating Query for the specific contact based on the provided UserId
		$stmt = $conn->prepare("UPDATE Contacts SET firstName=?, lastName=?, phoneNumber=?, emailAddress=? WHERE UserId=?");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $emailAddress, $UserId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>