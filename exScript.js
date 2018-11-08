var canvas = document.getElementById('space');
var c = canvas.getContext('2d');

var innerWidth = window.innerWidth - 20;
var innerHeight = window.innerHeight - 20;
var radius = 1;
var starsIndex = 0;
var stars = [];
var piSq = Math.PI*2;
var centerX = innerWidth/2;
var centerY = innerHeight/2;
var centerLength = 600;
var starRadius = null;
var starX = null;
var starY = null;
var numStars = 850;
var mouse = {};
var starX_dir = 0;
var starY_dir = 0;

canvas.width = innerWidth;
canvas.height = innerHeight;

// Moving the stars according to the mouse's movements
window.addEventListener('mousemove', function(e){
	mouse.x = e.x;
	
	if (mouse.x < centerX){
	  starX_dir += 10;
	}
	else {
	  starX_dir += -10;
	}
	
 });
	
// Generating the new stars
function star(x,y,z) {
    this.x = x;
	this.y = y;
	this.z = z;
	this.radius = radius;
	this.color = "white";
	starsIndex++;
	stars[starsIndex] = this;
	this.id = starsIndex;
	
	// Animating the stars
	this.update = function() {
	  starX = (this.x - centerX) * (centerLength / this.z);
	  starX += centerX;
	  
	  starY = (this.y - centerY) * (centerLength / this.z);
	  starY += centerY;
	  
	  starRadius = radius * (centerLength / this.z);
	  
	  starX += starX_dir;
	  starY += starY_dir;
	  
	  this.z += -10;
	  
	  if(this.z <= 0){
	     this.z = parseInt(innerWidth);
	  }
	  
	  this.draw();
	
	}
	
	// Function for drawing stars
	this.draw = function(){
		c.beginPath();
		c.arc(starX,starY,starRadius, piSq, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}
	
}	

// Setting up the X,Y,Z values
var s = 0;
for(s = 0; s < numStars; s++){
	x = Math.random() * innerWidth;
	y = Math.random() * innerHeight;
	z = Math.random() * innerWidth;
	new star(x,y,z);
}

// Function for the animation of the canvas objects
function animate(){
    requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0,0,innerWidth,innerHeight);
	
	for(var i in stars) {
	  stars[i].update();
	}
}

animate();