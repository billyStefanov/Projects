const keyLeft = 37;
const keyRight = 39;
const keySpace = 32;
const keyUp = 38;
const keyDown = 40;

const gameWidth = 800;
const gameHeight = 600;

const playerWidth = 20;
const playerSpeed = 600.0;
const laserSpeed = 200.0;
let laserCooldown = 2;

const enemyArmy = 10;
const enemyXPadding = 80;
const enemyYPadding = 70;
const enemyYDistance = 80;
const enemyBlasts = 10.0;

// global var containing most things
const gameState = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  upPressed: false,
  downPressed: false,
  playerX: 0,
  playerY: 0,
  playerCooldown: 0,
  lasers: [],
  enemies: [],
  enemyLasers: [],
  gameOver: false
};

function rectsIntersect(r1, r2) { // Hit Testing as we treat each image as a rectangle
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  ); // if all those conditions are not met - the rects are intersecting!
}

/* template literals - parts of a string ARE variables
${ - syntax to let JS know we want the value of our varialbe */
function setPosition(el, x, y) {
  el.style.transform = `translate(${x}px, ${y}px)`;
}

// So that the Player cannot move outside the game frame
function clamp(v, min, max) {
  if (v < min) {
    return min;
  } else if (v > max) {
    return max;
  } else {
    return v;
  }
}

function rand(min, max) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 1;
  return min + Math.random() * (max - min);
}

// Player - starting position, image, appending to container
function createPlayer($container) {
  gameState.playerX = gameWidth / 2;
  gameState.playerY = gameHeight - 50;
  const $player = document.createElement("img");
  $player.src = "png-files/billy-player.png";
  $player.className = "player";
  $container.appendChild($player);
  setPosition($player, gameState.playerX, gameState.playerY);
}

function destroyPlayer($container, player) {
  $container.removeChild(player);
  gameState.gameOver = true;
}

// dt*pS = pixels per second we travel
function updatePlayer(dt, $container) {
  if (gameState.leftPressed) {
    gameState.playerX -= dt * playerSpeed;
  }
  if (gameState.rightPressed) {
    gameState.playerX += dt * playerSpeed;
  }
  if (gameState.upPressed) {
    laserCooldown-=0.1;
  }
  if (gameState.downPressed) {
    laserCooldown+=0.1;
  }

  // instead of clamping to zero, which positions the player on the edge
  gameState.playerX = clamp(
    gameState.playerX,
    playerWidth,
    gameWidth - playerWidth
  );
// Generating new laserbeams (at player's location) if Spacebar is still down
  if (gameState.spacePressed && gameState.playerCooldown <= 0) {
    createLaser($container, gameState.playerX, gameState.playerY);
    gameState.playerCooldown = laserCooldown;
  }
  // Prohibiting continuous shooting 
  if (gameState.playerCooldown > 0) {
    gameState.playerCooldown -= dt;
  }

  const player = document.querySelector(".player");
  setPosition(player, gameState.playerX, gameState.playerY);
}

function createLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "png-files/laser-blue-3.png";
  $element.className = "laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  gameState.lasers.push(laser);
  setPosition($element, x, y);
}

function updateLasers(dt, $container) {
  const lasers = gameState.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    // this is to move the laser UP 
    laser.y -= dt * laserSpeed;
    // Removing the laser image from the DOM after it passes the top border
    if (laser.y < 0) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y); // setting them up as rectangles
    const r1 = laser.$element.getBoundingClientRect(); // using this function gives the objects the properties of a rect
    const enemies = gameState.enemies;
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (enemy.isDead) continue;
      const r2 = enemy.$element.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // if Enemy was hit
        destroyEnemy($container, enemy);
        destroyLaser($container, laser);
        break;
      }
    }
  }
  //filter sets it to "undefined" and JS removes it - did the same for the enemies and their laserbeams
  gameState.lasers = gameState.lasers.filter(e => !e.isDead);
}

function destroyLaser($container, laser) {
  $container.removeChild(laser.$element);
  laser.isDead = true;
}

function createEnemy($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "png-files/billy-invader.png";
  $element.className = "enemy";
  $container.appendChild($element);
  const enemy = {
    x,
    y,
    cooldown: rand(0.5, enemyBlasts),
    $element
  };
  gameState.enemies.push(enemy);
  setPosition($element, x, y);
}

function updateEnemies(dt, $container) {
  const dx = Math.sin(gameState.lastTime / 1000.0) * 50; // we use the sin and cos functions to make them rotate 
  const dy = Math.cos(gameState.lastTime / 1000.0) * 10;

  const enemies = gameState.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const x = enemy.x + dx;
    const y = enemy.y + dy;
    setPosition(enemy.$element, x, y); // update the DOM element 
    enemy.cooldown -= dt;
    if (enemy.cooldown <= 0) {
      createEnemyLaser($container, x, y);
      enemy.cooldown = enemyBlasts;
    }
  }
  gameState.enemies = gameState.enemies.filter(e => !e.isDead);
}

// identical to the destroyLasers function
function destroyEnemy($container, enemy) {
  $container.removeChild(enemy.$element);
  enemy.isDead = true;
}

function createEnemyLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "png-files/laser-red-2.png";
  $element.className = "enemy-laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  gameState.enemyLasers.push(laser);
  setPosition($element, x, y);
}

function updateEnemyLasers(dt, $container) {
  const lasers = gameState.enemyLasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y += dt * laserSpeed;
    if (laser.y > gameHeight) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const player = document.querySelector(".player");
    const r2 = player.getBoundingClientRect();
    if (rectsIntersect(r1, r2)) {
      // Player was hit
      destroyPlayer($container, player);
      break;
    }
  }
  gameState.enemyLasers = gameState.enemyLasers.filter(e => !e.isDead);
}

function init() {
  const $container = document.querySelector(".game");
  createPlayer($container); // space between 10 enemies is eA - 1
  const enemySpacing =
    (gameWidth - enemyXPadding * 2) / (enemyArmy - 1);    // three rows of enemies
  for (let j = 0; j < 3; j++) {
    const y = enemyYPadding + j * enemyYDistance;
    for (let i = 0; i < enemyArmy; i++) {         //Position the enemies horizontally based on the calculation Army-1
      const x = i * enemySpacing + enemyXPadding;
      createEnemy($container, x, y);
    }
  }
}

function playerHasWon() {
  return gameState.enemies.length === 0;
}

/* Game Director (making sure all elements that need to move - move)
Created the deltatime so that the speed of the game does not depend on the speed of the machine
If a button is continuously pressed the movement will not be 5px (e.g.) and instead will depend on the time that has elapsed since
the game has started */
function update(e) {
  const currentTime = Date.now();
  const dt = (currentTime - gameState.lastTime) / 1000.0;

  if (gameState.gameOver) {
    document.querySelector(".game-over").style.display = "block";
    return;
  }

  if (playerHasWon()) {
    document.querySelector(".congratulations").style.display = "block";
    return;
  }

  const $container = document.querySelector(".game");
  updatePlayer(dt, $container);
  updateLasers(dt, $container);
  updateEnemies(dt, $container);
  updateEnemyLasers(dt, $container);

  gameState.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

function onKeyDown(e) {
  if (e.keyCode === keyLeft) {
    gameState.leftPressed = true;
  } else if (e.keyCode === keyRight) {
    gameState.rightPressed = true;
  } else if (e.keyCode === keySpace) {
    gameState.spacePressed = true;
  } else if (e.keyCode === keyUp) {
    gameState.upPressed = true;
  } else if (e.keyCode === keyDown) {
    gameState.downPressed = true;
  }
}

function onKeyUp(e) {
  if (e.keyCode === keyLeft) {
    gameState.leftPressed = false;
  } else if (e.keyCode === keyRight) {
    gameState.rightPressed = false;
  } else if (e.keyCode === keySpace) {
    gameState.spacePressed = false;
  } else if (e.keyCode === keyUp) {
    gameState.upPressed = false;
  } else if (e.keyCode === keyDown) {
    gameState.downPressed = false;
  }
}

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);