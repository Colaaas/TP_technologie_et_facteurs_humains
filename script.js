const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

canvas.width = 1000;  // Agrandir le cadre
canvas.height = 600;

const paddle = {
    width: 100,
    height: 10,
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    color: "white",
    speed: 3, // Vitesse réduite de la raquette
    dx: 0 // Vitesse horizontale de la raquette
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: 2,  // Vitesse divisée par 2
    speedY: -2, // Vitesse divisée par 2
    color: "red"
};

const apple = {
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 50),
    radius: 30,
    color: "yellow"
};

let score = 0;
let gameOver = false;

const replayButton = document.getElementById("replayButton");

document.addEventListener("keydown", movePaddle);
document.addEventListener("keyup", stopPaddle);

function movePaddle(e) {
    if (e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    } else if (e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    }
}

function stopPaddle(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        paddle.dx = 0;
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

function spawnApple() {
    apple.x = Math.random() * (canvas.width - 50);
    apple.y = Math.random() * (canvas.height - 50);
}

function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    paddle.x += paddle.dx;

    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }

    // Collision avec la raquette avec modification de la direction en fonction de l'endroit de la collision
    if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        // Calcul de la position de collision sur la raquette
        let relativeIntersectX = ball.x - (paddle.x + paddle.width / 2);
        let normalizedRelativeIntersectionX = relativeIntersectX / (paddle.width / 2);
        let angle = normalizedRelativeIntersectionX * (Math.PI / 4); // L'angle change en fonction de la collision sur la raquette

        // Modifie la direction de la balle en fonction de l'angle
        ball.speedX = 3 * Math.sin(angle);  // Augmente la vitesse horizontale en fonction de l'angle
        ball.speedY = -Math.abs(3 * Math.cos(angle)); // La balle se dirige vers le haut avec une vitesse ajustée

    }

    if (ball.y + ball.radius > canvas.height) {
        gameOver = true;
        replayButton.style.display = "block";
    }

    // Collision avec la pomme
    const dist = Math.sqrt((ball.x - apple.x) ** 2 + (ball.y - apple.y) ** 2);
    if (dist < ball.radius + apple.radius) {
        score++;
        spawnApple();
        setTimeout(() => {}, 500); // Délai de 0.5s avant de réapparaître
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawCircle(apple.x, apple.y, apple.radius, apple.color);

    // Afficher le score
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 20, 30);
}

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function restartGame() {
    score = 0;
    ball.speedX = 2;
    ball.speedY = -2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    gameOver = false;
    replayButton.style.display = "none";
    gameLoop();
}

replayButton.addEventListener("click", restartGame);

gameLoop();
