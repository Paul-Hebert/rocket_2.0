<?php
	//Connect to db
	include('../../cheatsheet.php');

	//Get usernames
	$sql = "SELECT * FROM users";
	$stmt = $db->prepare($sql);
	$stmt->execute();

	$results = $stmt->fetchAll();

	$name = htmlspecialchars($_POST['name']);
	$password = htmlspecialchars($_POST['password']);

	$action = htmlspecialchars($_POST['action']);

	$taken = false;
	$i = 0;
	// Add usernames 
	foreach($results as $row){
		if ($row[name] == $name){
			$taken = $i;
		}
		$i++;
	}

	echo 'taken ="' . $taken . '";';


	if ($action == 'new' && $taken == false){
		$sql = "INSERT INTO users (name,password) VALUES (:name,:password)";
		$q = $db->prepare($sql);
		$q->execute(array(':name'=>$name,
							':password'=>$password));

		$db->query($sql);

	} else if($action == 'load' && $taken == true){
		$loaded = $results[$taken];

		if ($password == $loaded[password]){
			echo 'ship.cash ="' . $loaded[cash] . '";';
		} else{
			echo 'taken = "wrongPass";';
		}
	}

	$db = null;
?>