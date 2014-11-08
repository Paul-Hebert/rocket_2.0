function createClasses(){
	star = Object.create(null);
		star.type = 'star';

		star.fill = '#fff';

		star.scaleMin = 1.5;
		star.scaleMax = 2;

		star.distanceMin = 2;
		star.distanceMax = 4;

		star.speedMin = 0;
		star.speedMax = 0;

		star.screenLoop = true;
		star.collidable = false;

		star.decay = false;


	asteroid = Object.create(null);
		asteroid.type = 'asteroid';

		asteroid.fill = sky.gradient("r(1, .9, 1.5)#666-#000");

		asteroid.scaleMin = 3;
		asteroid.scaleMax = 10;

		asteroid.distanceMin = 1;
		asteroid.distanceMax = 1;

		asteroid.speedMin = -5;
		asteroid.speedMax = 5;

		asteroid.screenLoop = true;
		asteroid.collidable = true;

		star.decay = false;


	planet = Object.create(null);
		planet.type = 'planet';

		planet.fill = sky.gradient("r(1, .9, 1)#2F6CF9-#000");

		planet.scaleMin = 30;
		planet.scaleMax = 50;

		planet.distanceMin = 1.2;
		planet.distanceMax = 1.3;

		planet.speedMin = 0;
		planet.speedMax = 0;

		planet.screenLoop = false;
		planet.collidable = true;

		planet.decay = false;

		

	bullet = Object.create(null);
		bullet.type = 'bullet';

		bullet.fill = "red";

		bullet.scaleMin = 2;
		bullet.scaleMax = 2;

		bullet.distanceMin = 1;
		bullet.distanceMax = 1;

		bullet.screenLoop = false;
		bullet.collidable = true;

		bullet.decay = 100;
}


//Reset map arrays
function resetMap(){
	objects = new Array();
	SVGs = new Array();
}

//Generate map
function createMap(stars,asteroids,planets){
	for (i=0; i< stars; i++){
		createObject(i,star);
		createSVG(i,star);
	}
	for (i=0; i < planets; i++){
		createObject( SVGs.length , planet );
		createSVG( SVGs.length , planet );
	}
	for (i=0; i < asteroids; i++){
		createObject( SVGs.length , asteroid );
		createSVG( SVGs.length , asteroid );
	}
}

//Add a new star object to objects[].
function createObject(i,type){
	objects[i] = Object.create(null);
	objects[i].type = type.type;
	objects[i].dead = false;

	objects[i].scale = rando( type.scaleMin , type.scaleMax );
	objects[i].distance = rando( type.distanceMin , type.distanceMax );
	objects[i].relativeSize = objects[i].scale / objects[i].distance;

	if (type != bullet){
		objects[i].xSpeed = rando( type.speedMin , type.speedMax );
		objects[i].ySpeed = rando( type.speedMin , type.speedMax );
	
		objects[i].x = rando(1,screenWidth);
		objects[i].y = rando(1,screenHeight);
	} else{
		var angle = ship.rot *  3.141592653589793 / 180;

	    objects[i].xSpeed = Math.cos(angle) * 15 + ship.xSpeed;
	   	objects[i].ySpeed = Math.sin(angle) * 15 + ship.ySpeed;
		
		objects[i].x = screenWidth/2 /*- 7.5 * Math.cos(angle)*/;
		objects[i].y = screenHeight/2 /*+ 7.5 * Math.sin(angle)*/;	
	}

	objects[i].screenLoop = type.screenLoop;

	objects[i].collidable = type.collidable;
	if (objects[i].collidable){
		objects[i].colliding = new Array;
	}

	objects[i].decay = type.decay;
}

//Add a new star SVG to SVGs[].
function createSVG(i,type){
	svg = sky.circle(objects[i].x, objects[i].y, objects[i].relativeSize);

	svg.attr({ 'fill' : type.fill });

	SVGs.push(svg);
}
