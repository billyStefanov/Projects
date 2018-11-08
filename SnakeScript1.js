window.onload=function() {
    canv=document.getElementById("field");
    ctx=canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    setInterval(game, 75);
}

var px=py=18; // Player x and y velocity
var gs=23.8; // Grid size
var tc=38; // Tile count
var ax=ay=25; // Fruit x and y velocity
var xv=yv=0; // X and Y velocities
var trail=[];

var tail = 4;
var score = 0;

function game() {
    px+=xv;
    py+=yv;

    if(px<0) {
        px= tc-1;
    }
    if(px>tc-1) {
        px= 0;
    }
    if(py<0) {
        py= tc-1;
    }
    if(py>tc-1) {
        py= 0;
    }

    ctx.fillStyle ="#bfff80";
    ctx.fillRect(0,0,canv.width,canv.height);
 
    ctx.fillStyle = "pink";
    for(var i=0;i<trail.length;i++) {
        ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        if(trail[i].x==px && trail[i].y==py) { // You restart if you eat your tail
            tail = 4;
            score = 0;
            document.getElementById("score").innerHTML = "Score:<br/>" + score;
        }
    }
    
    trail.push({x:px,y:py}); // The trail can move
    while (trail.length>tail) {
        trail.shift();
    }
 
    if (ax==px && ay==py) { // Eat a fruit and you grow
        tail++;
        score+=10;
        document.getElementById("score").innerHTML = "Score:<br/>" + score;
        ax=Math.floor(Math.random()*tc);
        ay=Math.floor(Math.random()*tc);
    }

        ctx.fillStyle = "darkgrey";
        ctx.fillRect(ax*gs,ay*gs,gs-2 ,gs-2);
}

function keyPush(evt) {
    switch (evt.keyCode) {
        case 37:
            xv=-1;yv=0;
            break;
        case 38:
            xv=0;yv=-1;
            break;
        case 39:
            xv=1;yv=0;
            break;
        case 40:
            xv=0;yv=1;
            break;
    }
}