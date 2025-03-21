const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const paddle = {
    width: 100,
    height: 10,
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    color: "white",
    speed: 6, // Vitesse de déplacement de la raquette
    dx: 0 // Vitesse horizontale de la raquette
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: 2,
    speedY: -2,
    color: "red"
};

// Écouter les événements de pression des touches
document.addEventListener("keydown", movePaddle);
document.addEventListener("keyup", stopPaddle);

function movePaddle(e) {
    if (e.key === "ArrowRight") {
        paddle.dx = paddle.speed; // Déplace la raquette vers la droite
    } else if (e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed; // Déplace la raquette vers la gauche
    }
}

function stopPaddle(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        paddle.dx = 0; // Arrêter la raquette lorsqu'on relâche la touche
    }
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 2 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = -2;
}

function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Mouvements de la raquette
    paddle.x += paddle.dx;

    // Limiter les déplacements de la raquette pour ne pas sortir de l'écran
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Collision avec les murs
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }

    // Collision avec la raquette
    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.speedY *= -1;
    }

    // Reset la balle si elle touche le bas de l'écran
    if (ball.y + ball.radius > canvas.height) {
        resetBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
