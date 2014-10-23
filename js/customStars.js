
//Generate initial stars
function createStars(num){
	starObjects = new Array();
	starSVGs = new Array();

	for (i=0; i< num; i++){
		starObject(i);
		starSVG(i);
	}
}

//Add a new star object to starObjects[].
function starObject(i){
	starObjects[i] = Object.create(null);

	starObjects[i].scale = rando(1,1.5);
	starObjects[i].distance = rando(1,3);
	starObjects[i].relativeSize = starObjects[i].scale / starObjects[i].distance;

	starObjects[i].x = rando(1,screenWidth);
	starObjects[i].y = rando(1,screenHeight);
}

//Add a new star SVG to starSVGs[].
function starSVG(i){
	star = sky.circle(starObjects[i].x, starObjects[i].y, starObjects[i].relativeSize);

	star.attr({'id':'star' + i});
	star.attr({'class':'star'});

	starSVGs.push(star);
}

//Iterate through stars moving them.
function moveStars(x,y){
	for(i=0;i<starObjects.length;i++){
		// Set current star
		currentStar = starObjects[i];

		var parallax = currentStar.distance * 2;

		// Move stars. Adjusted by distance to create a parallax effect.
		currentStar.x += x/parallax;
		currentStar.y += y/parallax;
		
		// If stars are off the screen move them to the other side and randomize the other variable.
		if (currentStar.x > screenWidth){
			currentStar.x = 0;
			currentStar.y = rando(0,screenHeight);
		} else if (currentStar.x < 0){
			currentStar.x = screenWidth;
			currentStar.y = rando(0,screenHeight);
		}
		if (currentStar.y > screenHeight){
			currentStar.y = 0;
			currentStar.x = rando(0,screenWidth);
		} else if (currentStar.y < 0){
			currentStar.y = screenHeight;
			currentStar.x = rando(0,screenWidth);
		}

		// Animate changes.
		if (currentStar.x == 0 || currentStar.x == screenWidth || currentStar.y == 0 || currentStar.y == screenHeight){
			starSVGs[i].animate({cx:currentStar.x,cy:currentStar.y},0);			
		} else{
			starSVGs[i].animate({cx:currentStar.x},frameRate);
			starSVGs[i].animate({cy:currentStar.y},frameRate);
		}

	}
}