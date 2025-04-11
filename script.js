const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const speedSlider = document.getElementById("speedSlider");
const replayButton = document.getElementById("replayButton");

canvas.width = 1000;
canvas.height = 600;

startState = true;

let speed1 = parseInt(speedSlider.value);

speedSlider.addEventListener("input", function () {
    speed1 = parseInt(speedSlider.value);
});

startButton.addEventListener("click", function () {
    startgame();
});

// Joueur 1 (à gauche)
const paddle1 = {
    width: 10,
    height: 100,
    x: 20, // Position à gauche
    y: canvas.height / 2 - 50,
    color: "white",
    speed: speed1 + 1.2,
    dy: 0, // Vitesse verticale
    hitbox: {
        width: 10,
        height: 130, // Hitbox légèrement plus grande
        offsetY: -15 // Décalage vertical pour centrer la hitbox
    }
};

// Joueur 2 (à droite)
const paddle2 = {
    width: 10,
    height: 100,
    x: canvas.width - 30, // Position à droite
    y: canvas.height / 2 - 50,
    color: "white",
    speed: speed1 + 1.2,
    dy: 0, // Vitesse verticale
    hitbox: {
        width: 10,
        height: 130, // Hitbox légèrement plus grande
        offsetY: -15 // Décalage vertical pour centrer la hitbox
    }
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: speed1 * (Math.random() > 0.5 ? 1 : -1),
    speedY: speed1 * (Math.random() > 0.5 ? 1 : -1),
    color: "red"
};

let score1 = 0; // Score du joueur 1
let score2 = 0; // Score du joueur 2
let gameOver = false;

document.addEventListener("keydown", function (e) {
    // Empêcher les flèches haut et bas de modifier le slider
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
    }

    // Joueur 2 (flèches haut et bas)
    if (e.key === "ArrowUp") {
        paddle2.dy = -paddle2.speed;
    } else if (e.key === "ArrowDown") {
        paddle2.dy = paddle2.speed;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        paddle2.dy = 0;
    }
});

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = speed1 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = speed1 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Mettre à jour la vitesse de la balle en fonction du slider
    let ballSpeed = parseInt(speedSlider.value);

    // Normaliser la vitesse de la balle tout en conservant sa direction
    let currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
    ball.speedX = (ball.speedX / currentSpeed) * ballSpeed;
    ball.speedY = (ball.speedY / currentSpeed) * ballSpeed;

    // Déplacer le bot (paddle1)
    let botSpeed = ballSpeed * 0.53; // Vitesse maximale du bot
    if (ball.y < paddle1.y + paddle1.height / 2) {
        paddle1.y -= botSpeed; // Déplacer vers le haut
    } else if (ball.y > paddle1.y + paddle1.height / 2) {
        paddle1.y += botSpeed; // Déplacer vers le bas
    }

    // Empêcher le bot de sortir du canvas
    if (paddle1.y < 0) paddle1.y = 0;
    if (paddle1.y + paddle1.height > canvas.height) paddle1.y = canvas.height - paddle1.height;

    // Déplacer les paddles
    paddle2.y += paddle2.dy;

    // Empêcher le paddle 2 de sortir du canvas
    if (paddle2.y < 0) paddle2.y = 0;
    if (paddle2.y + paddle2.height > canvas.height) paddle2.y = canvas.height - paddle2.height;

    // Déplacer la balle
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Collision avec le haut et le bas du canvas
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY *= -1;
    }

    // Collision avec le paddle 1 (gauche)
    if (
        ball.x - ball.radius < paddle1.x + paddle1.width &&
        ball.y > paddle1.y + paddle1.hitbox.offsetY &&
        ball.y < paddle1.y + paddle1.height + paddle1.hitbox.offsetY
    ) {
        let relativeIntersectY = ball.y - (paddle1.y + paddle1.height / 2);
        let normalizedRelativeIntersectionY = relativeIntersectY / (paddle1.height / 2);
        let angle = normalizedRelativeIntersectionY * (Math.PI / 4);

        ball.speedX = Math.abs(ballSpeed) * Math.cos(angle);
        ball.speedY = ballSpeed * Math.sin(angle);
    }

    // Collision avec le paddle 2 (droite)
    if (
        ball.x + ball.radius > paddle2.x &&
        ball.y > paddle2.y + paddle2.hitbox.offsetY &&
        ball.y < paddle2.y + paddle2.height + paddle2.hitbox.offsetY
    ) {
        let relativeIntersectY = ball.y - (paddle2.y + paddle2.height / 2);
        let normalizedRelativeIntersectionY = relativeIntersectY / (paddle2.height / 2);
        let angle = normalizedRelativeIntersectionY * (Math.PI / 4);

        ball.speedX = -Math.abs(ballSpeed) * Math.cos(angle);
        ball.speedY = ballSpeed * Math.sin(angle);
    }

    // Si la balle sort à gauche (point pour le joueur 2)
    if (ball.x - ball.radius < 0) {
        score2++;
        resetBall();
    }

    // Si la balle sort à droite (point pour le joueur 1)
    if (ball.x + ball.radius > canvas.width) {
        score1++;
        resetBall();
    }

    // Vérifier si un joueur a atteint 10 points
    if (score1 === 10 || score2 === 10) {
        gameOver = true;
        replayButton.style.display = "block"; // Afficher le bouton "Rejouer"
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les paddles avec des coins arrondis
    drawRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, paddle1.color, false, true); // Coins arrondis à gauche
    drawRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, paddle2.color, true, false); // Coins arrondis à droite

    // Dessiner la balle
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Afficher les scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(score1 + "  |  " + score2, canvas.width / 2, 40);

    // Afficher le message de fin de partie
    if (gameOver) {
        ctx.font = "48px Arial";
        ctx.fillStyle = "skyblue";
        ctx.fillText(
            score1 === 10 ? "L'ordinateur a gagné !" : "Vous avez gagné !",
            canvas.width / 2,
            canvas.height / 2
        );
    }
}

function drawRect(x, y, w, h, color, roundLeft = false, roundRight = false) {
    ctx.fillStyle = color;
    ctx.beginPath();

    // Dessiner un rectangle avec des coins arrondis
    if (roundLeft) {
        ctx.moveTo(x + 10, y); // Coin supérieur gauche arrondi
        ctx.arcTo(x, y, x, y + 10, 10);
        ctx.lineTo(x, y + h - 10);
        ctx.arcTo(x, y + h, x + 10, y + h, 10); // Coin inférieur gauche arrondi
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w, y);
        ctx.closePath();
    } else if (roundRight) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w - 10, y);
        ctx.arcTo(x + w, y, x + w, y + 10, 10); // Coin supérieur droit arrondi
        ctx.lineTo(x + w, y + h - 10);
        ctx.arcTo(x + w, y + h, x + w - 10, y + h, 10); // Coin inférieur droit arrondi
        ctx.lineTo(x, y + h);
        ctx.closePath();
    } else {
        // Rectangle normal
        ctx.rect(x, y, w, h);
    }

    ctx.fill();
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function startgame() {
    speed1 = parseInt(speedSlider.value);
    startButton.style.display = "none";
    startState = false;
    resetBall();
    gameLoop();
}

replayButton.addEventListener("click", function () {
    score1 = 0;
    score2 = 0;
    resetBall();
    gameOver = false;
    replayButton.style.display = "none"; // Cacher le bouton "Rejouer"
    gameLoop();
});

