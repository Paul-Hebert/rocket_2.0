//Random taken names. Just to be used until mySQL is implemented.
availableParts = ['fin.png','porthole.png','gun.png','jet.png'];


/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Initial set-up
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	ship = Object.create(null);
	ship.name = null;
	ship.type = null;

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Start Menu
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	// Set Button functions in start menu.
	$( function(){
		$( '#newGame, #loadGame' ).click( function(){
			hideHidden( 'startMenu' , $(this).attr( 'id' ) + 'Hidden' );
			showHidden( $(this).attr( 'id' ) + 'Hidden' );
		});


		$( '#startNew' ).click( function(){
			ship.name = $( '#newName' ).val();
			ship.password = $( '#newPass' ).val();

			if (ship.name != '' && ship.name != null){
				if (ship.password != '' && ship.password != null){
					findName('new');
					if ( !taken ){
						hideMenus();
						newGame();
					} else{
						alert('Sorry, that name is already taken. Please try another.');
					}
				} else{
					alert('Please enter a password.');
				}
			} else{
					alert('Please enter a name to continue.');				
			}
		});


		$( '#startLoad' ).click( function(){
			ship.name = $( '#loadName' ).val();
			ship.password = $( '#loadPass' ).val();

			if (ship.name != '' && ship.name != null){
				if (ship.password != '' && ship.password != null){
					findName('load');
					if ( taken != false){
						if ( taken != 'wrongPass'){
							hideMenus();
							loadGame();
						} else{
							alert("Sorry. You\'ve entered the wrong password. Please try again.");		
						}
					} else{
						alert('Sorry, we couldn\'t find your save file. Please make sure you spelled your username correctly.');
					}
				} else{
					alert('Please enter a password.');
				}
			} else{
					alert('Please enter a name to continue.');				
			}
		});

	});

	// Hide all shown $('.noHeight')s within the parent.
	function hideHidden(parent,child){
		$( '#' + parent + ' .noHeight' ).each(function(){
			if( $(this).css( 'height' ) != '0px'  && $(this).attr('id') != child ){
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

	//Get current list of usernames in database.
	function findName(action){
		takenNames = [];

		$.ajax({
		    url:"php/getNames.php",
		    type:"POST",
		    data:{'name': ship.name,
		    		'password': ship.password,
					'action':action},
		    dataType:"script",
		    async:false
		});
	}


	//Check to see if username already exists.
	function checkName(){

	}


	function newGame(){
		buildShip();
	}


	function loadGame(){

	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Ship Builder
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	function buildShip(){
		var shipBuilderInterface = '<div id="shipBuilder">';
			shipBuilderInterface += '<img src="' + 'imgs/base.png' + '" id="shipBase"/>';

			shipBuilderInterface += '<div id="parts">';

				//List available parts
				for(i=0; i < availableParts.length; i++){
					shipBuilderInterface += '<div class="part">';	
					shipBuilderInterface += '<img src="imgs/' + availableParts[i] + '">';
					shipBuilderInterface += '<span>' + availableParts[i] + '</span>';
					shipBuilderInterface += '</div>';
				}

			shipBuilderInterface += '<input type="button" id="setShip" value="Blast off!"/>';

			shipBuilderInterface += '</div>';
		shipBuilderInterface += '</div>';

		$('body').append(shipBuilderInterface);

		$('.part img').click( function(){
			dragAndDrop( $(this) );
		});
	}


	function dragAndDrop(part){
		part.parent().remove();
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Game Loop
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	function mainLoop() {
	    setInterval( function(){
	        updateGame();
	        drawGame();
	    },1000/40);
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    General Use
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

function rando(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

