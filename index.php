<!DOCTYPE html>

<html>
	<head>
		<?php 
			include('php/resources.php'); 
		?>
	</head>

	<body>
			<div id="startMenu">
				<span id="newGame" class="menuItem">
					New Game
				</span>

				<span id="newGameHidden" class="menuItem noHeight">
					Name your ship:
					<input id="newName" type="text" />
					Password:
					<input id="newPass" type="text" />

					<input id="startNew" type="button" value="Blast off!"/>
				</span>

				
				<span id="loadGame" class="menuItem">
					Load Game
				</span>

				<span id="loadGameHidden" class="menuItem noHeight">
					Enter your ship's name:
					<input id="loadName" type="text" />
					Password:
					<input id="loadPass" type="text" />

					<input id="startLoad" type="button" value="Blast off!"/>
				</span>
			</div>
	</body>
</html>