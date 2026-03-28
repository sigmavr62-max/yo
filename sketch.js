const TILE_SIZE = 64;
const MAP_SIZE = 8;
const FOV = 60 * (Math.PI / 180); // Convert 60 degrees to radians

const worldMap = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

let player = {
    x: 150,
    y: 150,
    dir: 0,
    speed: 3
};

function setup() {
    createCanvas(640, 400);
}

function draw() {
    background(30); // Ceiling color
    
    // Draw Floor
    noStroke();
    fill(60);
    rect(0, height / 2, width, height / 2);

    movePlayer();
    castRays();
}

function movePlayer() {
    if (keyIsDown(LEFT_ARROW)) player.dir -= 0.05;
    if (keyIsDown(RIGHT_ARROW)) player.dir += 0.05;

    let nextX = player.x;
    let nextY = player.y;

    if (keyIsDown(UP_ARROW)) {
        nextX += cos(player.dir) * player.speed;
        nextY += sin(player.dir) * player.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        nextX -= cos(player.dir) * player.speed;
        nextY -= sin(player.dir) * player.speed;
    }

    // Simple collision detection
    if (worldMap[floor(nextY / TILE_SIZE)][floor(nextX / TILE_SIZE)] === 0) {
        player.x = nextX;
        player.y = nextY;
    }
}

function castRays() {
    let startAngle = player.dir - FOV / 2;
    
    for (let i = 0; i < width; i++) {
        let rayAngle = startAngle + (i / width) * FOV;
        let distance = 0;
        let x = player.x;
        let y = player.y;

        let cosA = cos(rayAngle);
        let sinA = sin(rayAngle);

        // March the ray forward until it hits a wall
        while (distance < 800) {
            distance += 2; 
            x = player.x + cosA * distance;
            y = player.y + sinA * distance;

            if (worldMap[floor(y / TILE_SIZE)][floor(x / TILE_SIZE)] === 1) {
                break;
            }
        }

        // Fix fish-eye distortion
        let correctedDist = distance * cos(rayAngle - player.dir);
        
        // Calculate the height of the wall slice
        let wallHeight = (TILE_SIZE * height) / correctedDist;

        // Draw the wall slice (Pen-style)
        let brightness = map(correctedDist, 0, 800, 255, 50);
        stroke(brightness);
        line(i, (height / 2) - (wallHeight / 2), i, (height / 2) + (wallHeight / 2));
    }
}
