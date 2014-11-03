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

	$options = array('cost' => 11);
	$hash = password_hash($password, PASSWORD_BCRYPT, $options);

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


	if ($action == 'new'){
		if ($taken == false){
			$sql = "INSERT INTO users (name,password) VALUES (:name,:password)";
			$q = $db->prepare($sql);
			$q->execute(array(':name'=>$name,
								':password'=>$hash));

			$db->query($sql);
			echo 'hideMenus();
				loadGame();';
		} else{
			echo "if ( !taken ){
						hideMenus();
						newGame();
					} else{
						alert('Sorry, that name is already taken. Please try another.');
					}";
		}

	} else if($action == 'load'){
		if ($taken == true){
			$loaded = $results[$taken];
			
			if (password_verify($password, $loaded[password])){
				echo 'ship.cash ="' . $loaded[cash] . '";';
				echo 'hideMenus();
					loadGame();';
			} else{
				echo 'alert("Sorry. You\'ve entered the wrong password. Please try again.");';
			}
		} else{
			echo "alert('Sorry, we couldn\'t find your save file. Please make sure you spelled your username correctly.');";
		}
	}

	$db = null;
?>