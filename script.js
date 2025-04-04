const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const speedSlider = document.getElementById("speedSlider");

canvas.width = 1000;
canvas.height = 600;

let speed1 = parseInt(speedSlider.value); // Vitesse par défaut de la et de la balle

speedSlider.addEventListener("input", function () {
    speed1 = parseInt(speedSlider.value);
});

startButton.addEventListener("click", function () {
    speed1 = parseInt(speedSlider.value); // Prendre la vitesse choisie
    startButton.style.display = "none"; // Cacher le bouton après le démarrage
    replayButton.style.display = "none"; // Cacher le bouton de replay s'il était affiché
    gameOver = false; // S'assurer que la partie n'est pas en état "game over"
    restartGame(); // Lancer la partie proprement
});

const paddle = {
    width: 100,
    height: 10,
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    color: "white",
    speed: speed1, // Vitesse de la raquette
    dx: 0 // Vitesse horizontale de la raquette
};

// Hitbox de la raquette
const paddleHitbox = {
    width: paddle.width * 1.3, // Hitbox de la raquette plus large
    height: paddle.height,
    offsetX: (paddle.width * 1.3 - paddle.width) / 2 // Décalage horizontal pour centrer la hitbox
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: speed1,
    speedY: -speed1,
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
document.addEventListener("keydown", handleKeyPress);

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

// Nouvelle fonction pour gérer l'appui sur la touche "Entrer"
function handleKeyPress(e) {
    if (e.key === "Enter" && gameOver) {
        restartGame();
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
    ball.speedX = speed1 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = -speed1;
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
        ball.x > paddle.x - paddleHitbox.offsetX &&
        ball.x < paddle.x + paddle.width + paddleHitbox.offsetX
    ) {
        // Calcul de la position de collision sur la raquette
        let relativeIntersectX = ball.x - (paddle.x + paddle.width / 2);
        let normalizedRelativeIntersectionX = relativeIntersectX / (paddle.width / 2);
        let angle = normalizedRelativeIntersectionX * (Math.PI / 4); // L'angle change en fonction de la collision sur la raquette

        // Modifie la direction de la balle en fonction de l'angle
        ball.speedX = (speed1*1.5) * Math.sin(angle);  // Augmente la vitesse horizontale en fonction de l'angle
        ball.speedY = -Math.abs((speed1*1.5) * Math.cos(angle)); // La balle se dirige vers le haut avec une vitesse ajustée
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
    // Dessiner la raquette visible
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
    speed1 = parseInt(speedSlider.value); // Mettre à jour la vitesse
    score = 0;
    resetBall();
    gameOver = false;
    replayButton.style.display = "none";
    gameLoop(); // Lancer la boucle de jeu
}


replayButton.addEventListener("click", restartGame);

