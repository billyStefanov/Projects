var canvas = document.getElementById('space_box');
var c = canvas.getContext('2d');

var innerWidth = window.innerWidth - 20;
var innerHeight = window.innerHeight - 20;
var radius = 2;
var starsIndex = 0;
var stars = [];
var piSq = Math.PI*2;
var centerX = innerWidth/2;
var centerY = innerHeight/2;
var centerLength = 700;
var starRadius = null;
var starX = null;
var starY = null;
var numStars = 400;

canvas.width = innerWidth;
canvas.height = innerHeight;
	
	
// Местенето на звездите според движенията на мишката

	
// Function за "генериране" на нови звезди
function star(x,y,z){
    this.x = x;
	this.y = y;
	this.z = z;
	this.radius = radius;
	this.color = "white";
	starsIndex++;
	stars[starsIndex] = this;
	this.id = starsIndex;
	
	// Анимиране на звездите
	this.update = function(){
	  starX = (this.x - centerX) * (centerLength / this.z);
	  starX += centerX;
	  
	  starY = (this.y - centerY) * (centerLength / this.z);
	  starY += centerY;
	  
	  starRadius = radius * (centerLength / this.z);
	  
	  
	  
	  this.z += -10;
	  
	  if(this.z <= 0){
	     this.z = parseInt(innerWidth);
	  }
	  
	  this.draw();
	
	}
	
	// Function за рисуването на звездата
	this.draw = function(){
		c.beginPath();
		c.arc(starX,starY,starRadius, piSq, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}
	
}	

// X,Y,Z values настройване
var s = 0;
for(s = 0; s < numStars; s++){
	x = Math.random() * innerWidth;
	y = Math.random() * innerHeight;
	z = Math.random() * innerWidth;
	new star(x,y,z);
}

// Function за самото анимиране
function animate(){
    requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0,0,innerWidth,innerHeight);
	
	for( var i in stars){
	  stars[i].update();
	}
}

animate();