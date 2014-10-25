
star = Object.create(null);
	star.scaleMin = 1;
	star.scaleMax = 1.5;

	star.distanceMin = 1;
	star.distanceMax = 3;

	star.speedMin = 0;
	star.speedMax = 0;
	star.id = 'star';


asteroid = Object.create(null);
	asteroid.scaleMin = 3;
	asteroid.scaleMax = 10;

	asteroid.distanceMin = 1;
	asteroid.distanceMax = 1;

	asteroid.speedMin = -5;
	asteroid.speedMax = 5;
	asteroid.id = 'asteroid';


//Generate stars and asteroids
function createObjects(stars,asteroids){
	objects = new Array();
	SVGs = new Array();

	for (i=0; i< stars; i++){
		createObject(i,star);
		createSVG(i,star);
	}
	for (i=0; i < asteroids; i++){
		createObject( SVGs.length , asteroid );
		createSVG( SVGs.length , asteroid );
	}
}

//Add a new star object to objects[].
function createObject(i,type){
	objects[i] = Object.create(null);

	objects[i].scale = rando( type.scaleMin , type.scaleMax );
	objects[i].distance = rando( type.distanceMin , type.distanceMax );
	objects[i].relativeSize = objects[i].scale / objects[i].distance;

	objects[i].xSpeed = rando( type.speedMin , type.speedMax );
	objects[i].ySpeed = rando( type.speedMin , type.speedMax );

	objects[i].x = rando(1,screenWidth);
	objects[i].y = rando(1,screenHeight);
}

//Add a new star SVG to SVGs[].
function createSVG(i,type){
	svg = sky.circle(objects[i].x, objects[i].y, objects[i].relativeSize);

	svg.attr({ 'id' : type.id + i });
	svg.attr({ 'class' : type.id });

	SVGs.push(svg);
}
