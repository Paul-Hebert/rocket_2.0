//Random taken names. Just to be used until mySQL is implemented.
takenNames = ['Tom','John','Leroy Jenkins'];



/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Start Menu
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

// Set Button functions in start menu.
$( function(){
	$( '#newGame, #loadGame' ).click( function(){
		hideHidden( 'startMenu' );
		showHidden( $(this).attr( 'id' ) + 'Hidden' );
	});

	$( '#startNew' ).click( function(){
		name = $( '#newName' ).val();
		if ( !findName() ){
			hideMenus();
			newGame();
		} else{
			alert('Sorry, that name is already taken. Please try another.');
		}
	});

	$( '#startLoad' ).click( function(){
		name = $( '#loadName' ).val();
		if ( findName() ){
			hideMenus();
			loadGame();
		} else{
			alert('Sorry, we couldn\'t find your save file. Please make sure you spelled your username correctly.');
		}
	});

});

// Hide all shown $('.noHeight')s within the parent.
function hideHidden(parent){
	$( '#' + parent + ' .noHeight' ).each(function(){
		if( $(this).css( 'height' ) != '0px' ){
			$(this).animate({
				'height':'0px'
			}, 100);
		}
	});
}

// Show a specific $('.noHeight').
function showHidden(item){
	$( '#' + item ).animate({
		'height': '100px'
	},400);
}

// Remove startMenu.
function hideMenus(){
	$( '#startMenu' ).remove();
}

//Check to see if username already exists.
function findName(){
	for(i = 0; i < takenNames.length; i++){
		if (name == takenNames[i]){
			return true;
		}
	}	

	return false;
}

function newGame(){
	buildShip();
}

function loadGame(){

}