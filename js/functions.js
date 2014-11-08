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

	ship.health = 10;

	ship.speed = .3;
	ship.maxSpeed = 50;
	ship.speedHyp = 0;


	ship.thrust = 6;
	ship.rot = 90;

	ship.colliding = new Array;

	ship.reload = 3;
	ship.reloadCounter = 100;

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

	map = {68: false, 65: false, 87: false, 83: false, 37: false, 38: false, 39: false, 32: false, 40: false};

	//****************************************************************************************//
	//  Map Setup   //
	//****************************************************************************************//

	$( function(){
		// Get screen dimensions
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;

		// Set up SVG drawing field.
		sky = Snap(screenWidth,screenHeight);
		sky.attr({'id':'sky'});

		// Set up object templates
		createClasses();

		// Create stars, asteroids, planets
		resetMap();
		createMap(30,6,1);

		frameRate = 1000/12;
		ship.xSpeed = .5;
		ship.ySpeed = 2;

		//Begin loop
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
		    dataType:"script"
		});
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

	    	// If game has begun do ship functions
	    	if (typeof shipSVG !== 'undefined'){
	    		// Check for key input
		    	checkInput();
		    	// Redraw ship based on rotation
		    	drawShip();
		    }

		    ship.colliding.length = 0;

		    // Move all objects based on ship's speed and their speed.
	        move(ship.xSpeed,ship.ySpeed);

	        reloadGun(ship);

	        // Request another animation frame.
	        mainLoop();
		});
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    Main Play functions
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

	function blastOff(){
		base = sky.circle(screenWidth/2, screenHeight/2, 15);
		base2 = sky.rect(screenWidth/2, screenHeight/2-15,15,30);

		cap = sky.circle(screenWidth/2-15,screenHeight/2,7.5);
		gun = sky.rect(screenWidth/2-26,screenHeight/2-2, 15,5);

		shipSVG = sky.g(base,base2,cap,gun);

		shipSVG.attr({
			'fill':'red'
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
                if (map[83] || map[40]){
					land();
                }
                if (map[32]){
                	shoot();
                }
	}


	function rotate(target,dir){
		target.rot += target.thrust * dir;
		if (target.rot > 360){
			target.rot -= 360;
		} else if (target.rot < 0){
			target.rot += 360;
		}
	}


	function accelerate(target){
		var angle = ship.rot *  3.141592653589793 / 180;

		var speed = target.speed;

	    //if (angle != 0 && angle != 90 && angle != 180 && angle != 270 && angle != 360){
	    	var yChange = Math.sin(angle) * speed;
	    	var xChange = Math.cos(angle) * speed;
	    /*} else if (angle == 0 || angle == 180){
	    	var xChange = speed;
	    } else{
	    	var yChange = speed;
	    }*/

	    target.xSpeed += xChange;
	    target.ySpeed += yChange;

	    target.speedHyp = Math.sqrt(Math.pow(target.xSpeed,2)*Math.pow(target.ySpeed,2));
	    if(target.speedHyp > target.maxSpeed){
	    	target.xSpeed *= target.maxSpeed/target.speedHyp;
	    	target.ySpeed *= target.maxSpeed/target.speedHyp;
	    }
	}


	function drawShip(){
		shipSVG.attr({'transform':'rotate(' + ship.rot + ',' + screenWidth/2 + ',' + screenHeight/2 + ')'});	
	}


	function move(x,y){
		// Iterate through objects
		for(i=0; i < objects.length; i++){
			// Set current object
			current = objects[i];

			if (current.decay != false){
				current.decay --;
				if (current.decay <= 0){
					current.dead = true;
					SVGs[i].attr({
							'fill':'#000'
						});
				}
			}

			if (current.dead != true){
				if (current.dead === 'dying'){
					if (current.type == 'asteroid'){
						// Turn asteroids to gold.
						SVGs[i].attr({
							'r':'3',
							'fill':'gold'
						});

						objects[i].type = 'gold';
						objects[i].screenLoop = false;

						objects[i].xSpeed = 0;
						objects[i].ySpeed = 0;					
						objects[i].relativeSize = 3;
						objects[hit].dead = 'false';
					}else if(current.type == 'gold'){
						SVGs[i].attr({
							'fill':'#000'
						});
				
						objects[hit].dead = 'true';	
						ship.gold += rando(5,10);					
					}
				} else{
					var parallax = current.distance * 1;

					// Move objects. Adjusted by distance to create a parallax effect.
					current.x += x/parallax - current.xSpeed;
					current.y += y/parallax - current.ySpeed;
					
					// If objects have screenLoop and are off the screen move them to the other side and randomize the other variable.
					if (current.screenLoop){
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
					}

					// If objects are 'collidable,' check for collisions.
					if (current.collidable){
						collisionTest(current,i);
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
		}
	}


	function collisionTest(target,num){
		target.colliding.length = 0;
		for(z = 0; z < objects.length - 1; z++){
			if (num != z){
				if (objects[z].collidable){
					hypotenuse = objects[num].relativeSize + objects[z].relativeSize;
					horizontal = objects[num].x - objects[z].x;
					vertical = objects[num].y - objects[z].y;

					if (Math.pow(hypotenuse,2) >= Math.pow(horizontal,2) + Math.pow(vertical,2) ){
						target.colliding.push(z);
						//console.log(objects[z].type + '/' + objects[num].type);
					}
				}
			}
		}

		for (z = 0; z < target.colliding.length; z++ ){
			hit = target.colliding[z];
		
			if (target.type == 'bullet' && objects[hit].type == 'asteroid'){
				//console.log('hit');
				objects[hit].dead = 'dying';
			}
		}

		if (target.x < screenWidth/2 + 25 + target.relativeSize && target.x > screenWidth/2 - 25 - target.relativeSize && target.y < screenHeight/2 + 25 + target.relativeSize && target.y > screenHeight/2 - 25 - target.relativeSize){
			ship.colliding.push( target.type );
			console.log(ship.colliding);
			if (target.type == 'gold'){
				objects[num].dead = 'dying';
			} else if(target.type == 'bullet'){
				ship.health --;
				console.log(ship.health);
				if (ship.health <= 0){
					console.log('Game Over!');
				}
			}
		}
	}


	function land(){
		if (ship.speedHyp < 5){
			for(i = 0; i < ship.colliding.length; i++){
				alert('land');
			}
		} else{
			alert("You're going too fast!");
		}
	}


	function shoot(){
		if (ship.reload < ship.reloadCounter){
			createObject( SVGs.length , bullet );
			createSVG( SVGs.length , bullet );

			ship.reloadCounter = 0;
		}	
	}


	function reloadGun(){
		ship.reloadCounter ++;
	}

/*/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
    General Use
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////*/

function rando(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

