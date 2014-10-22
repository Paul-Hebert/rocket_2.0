
// Set up starfield on load.
$( function(){
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	starDensity = rando(100,150);

	sky = Snap(screenWidth,screenHeight);
	createStars(starDensity);

	setInterval("move(1,3)",200);
})

function createStars(num){
	stars = new Array();
	starNum = new Array();

	for (i=0; i< num; i++){
		starObject(i);
		starSVG(i);
	}
}

function starObject(i){
	stars[i] = Object.create(null);

	stars[i].scale = rando(1,1.5);
	stars[i].distance = rando(1,3);
	stars[i].relativeSize = stars[i].scale / stars[i].distance;

	stars[i].x = rando(1,screenWidth);
	stars[i].y = rando(1,screenHeight);
}

function starSVG(i){
	star = sky.circle(stars[i].x, stars[i].y, stars[i].relativeSize);

	star.attr({'id':'star' + i});
	star.attr({'class':'star'});

	starNum.push(star);
}

function move(x,y){
	for(i=0;i<stars.length;i++){
		currentStar = stars[i];

		// Move stars. Adjusted by distnace to create a parallax effect.
		currentStar.x += x/currentStar.distance;
		currentStar.y += y/currentStar.distance;
		
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
			starNum[i].animate({cx:currentStar.x},0);
			starNum[i].animate({cy:currentStar.y},0);			
		} else{
			starNum[i].animate({cx:currentStar.x},200);
			starNum[i].animate({cy:currentStar.y},200);
		}

	}
}