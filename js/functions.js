//Random taken names. Just to be used until mySQL is implemented.
availableParts = ['fins','porthole','gun','jet1'];


/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Initial set-up
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	//****************************************************************************************//
	//  Ship Attributes   //
	//****************************************************************************************//

	ship = Object.create(null);
	ship.name = null;
	ship.type = null;
	ship.speed = .3;
	ship.thrust = 4;
	ship.rot = 90;

	//****************************************************************************************//
	//  Input Control   //
	//****************************************************************************************//

	//  Set down keys to true;
	$(document).keydown(function(e) {
	    if (e.keyCode in map) {
	        map[e.keyCode] = true;
	        userInput = false;
	    } //  Reset keys on keyUp.
	}).keyup(function(e) {
	    if (e.keyCode in map) {
	        map[e.keyCode] = false;
	    }
	    return false;
	});

	map = {68: false, 65: false, 87: false, 37: false, 38: false, 39: false};

	//****************************************************************************************//
	//  Map Setup   //
	//****************************************************************************************//

	$( function(){
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;

		sky = Snap(screenWidth,screenHeight);
		
		createObjects(35,5);

		frameRate = 1000/12;
		ship.xSpeed = .5;
		ship.ySpeed = 2;

		mainLoop();
	});

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
		blastOff();
	}


	function loadGame(){
		blastOff();
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Ship Builder
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	$( function(){
		//newGame();
	});

	function buildShip(){
		    shipBuilderInterface = '<div id="shipBuilder">';
			shipBuilderInterface += '<img src="' + 'imgs/base.svg' + '" id="shipBase"/>';

			shipBuilderInterface += '<div id="slots">';
				for (i=0;i<6;i++){
					shipBuilderInterface += '<div class="slot"></div>';
				}
			shipBuilderInterface += '</div>';


			shipBuilderInterface += '<div id="parts">';
				//List available parts
				for(i=0; i < availableParts.length; i++){
					shipBuilderInterface += '<div class="part">';	
					shipBuilderInterface += '<img src="imgs/' + availableParts[i] + '.svg">';
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
	    window.requestAnimationFrame(function(){

	    	if (typeof shipSVG !== 'undefined'){
		    	checkInput();
		    	drawShip();
		    }
	        move(ship.xSpeed,ship.ySpeed);
	        mainLoop();
		});
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Main Play functions
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	function blastOff(){
		base = sky.rect(screenWidth/2, screenHeight/2, 30,15);
		other = sky.circle(screenWidth/2,screenHeight/2 + 7.5,7.5);
		shipSVG = sky.g(base,other);

		shipSVG.click( function(){
			alert(angle);
		})

		shipSVG.attr({
			'fill':'red',
			'border-right':'#fff'
		});
	}

	function checkInput(){
                if (map[68] || map[39]){
                    rotate(ship,1);
                }
                if (map[65] || map[37]){
                    rotate(ship,-1);
                }
                if (map[87] || map[38]){
					accelerate(ship);
                }
	}

	function accelerate(target){
		var angle = ship.rot *  3.141592653589793 / 180;

		var speed = target.speed;

	    if (angle != 0 && angle != 90 && angle != 180 && angle != 270 && angle != 360){
	    	var yChange = Math.sin(angle) * speed;
	    	var xChange = Math.cos(angle) * speed;
	    } else if (angle == 0 || angle == 180){
	    	var xChange = speed;
	    } else{
	    	var yChange = speed;
	    }

	    target.xSpeed += xChange;
	    target.ySpeed += yChange;
	}

	function rotate(target,dir){
		target.rot += target.thrust * dir;
		if (target.rot > 360){
			target.rot -= 360;
		} else if (target.rot < 0){
			target.rot += 360;
		}
	}

	function drawShip(){
		shipSVG.attr({'transform':'rotate(' + ship.rot + ',' + screenWidth/2 + ',' + screenHeight/2+ ')'});	
	}

	function move(x,y){
		for(i=0;i<objects.length;i++){
			// Set current star
			current = objects[i];

			var parallax = current.distance * 1;

			// Move stars. Adjusted by distance to create a parallax effect.
			current.x += x/parallax - current.xSpeed;
			current.y += y/parallax - current.ySpeed;
			
			// If stars are off the screen move them to the other side and randomize the other variable.
			if (current.x > screenWidth){
				current.x = 0;
				current.y = rando(0,screenHeight);
			} else if (current.x < 0){
				current.x = screenWidth;
				current.y = rando(0,screenHeight);
			}
			if (current.y > screenHeight){
				current.y = 0;
				current.x = rando(0,screenWidth);
			} else if (current.y < 0){
				current.y = screenHeight;
				current.x = rando(0,screenWidth);
			}

			// Animate changes.
			if (current.x == 0 || current.x == screenWidth || current.y == 0 || current.y == screenHeight){
				SVGs[i].animate({cx:current.x,cy:current.y},0);			
			} else{
				SVGs[i].animate({cx:current.x},frameRate);
				SVGs[i].animate({cy:current.y},frameRate);
			}
		}
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    General Use
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

function rando(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

