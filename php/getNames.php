<?php
	include('../../cheatsheet.php');

	$sql = "SELECT * FROM users";
	$stmt = $db->prepare($sql);
	$stmt->execute();

	$results = $stmt->fetchAll();

		foreach($results as $row){
			echo 'takenNames.push("' . $row[name] . '");';
		}


	$db = null;
?>