console.log("Raunak Kaushal ❤");
const gameScreen = document.querySelector(".game-screen");
const playBtn = document.getElementById("play-btn");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
const basketOne = document.querySelector(".basket-1");
const basketTwo = document.querySelector(".basket-2");
const basketThree = document.querySelector(".basket-3");
const lives = [document.getElementById("life1"), document.getElementById("life2")];
const finalScoreDisplay = document.getElementById("final-score");
const gameOverCard = document.getElementById("game-over-screen");
const scoreDisplay = document.getElementById("score");
const playAgainBtn = document.getElementById("restart-btn");

let currentBasketIndex = 1;
let score = 0;
let missedBalls = 0;
let gameStarted = false;
let intervalId;
let ballSpeed = 6;
let createIntensity = 1500;
let ballIntervals = [];

playBtn.addEventListener("click", () => {
    gameScreen.classList.remove("active"); 
    startGame();
});

function startGame() {
    gameStarted = true;
    updateBasketVisibility();
    createBalls();
}

function updateBasketVisibility() {
    basketOne.style.display = currentBasketIndex === 0 ? "block" : "none";
    basketTwo.style.display = currentBasketIndex === 1 ? "block" : "none";
    basketThree.style.display = currentBasketIndex === 2 ? "block" : "none";
}

// Update ball speed and interval
function updateBallSpeed() {
    if (score >= 55) {
        ballSpeed = 20;
        createIntensity = 120;
    } else if (score >= 45) {
        ballSpeed = 18;
        createIntensity = 200;
    } else if (score >= 31) {
        ballSpeed = 15;
        createIntensity = 400;
    } else if (score >= 23) {
        ballSpeed = 12;
        createIntensity = 600;
    } else if (score >= 15) {
        ballSpeed = 10;
        createIntensity = 800;
    } else if (score >= 8) {
        ballSpeed = 8;
        createIntensity = 1000;
    } else {
        ballSpeed = 6;
        createIntensity = 1300;
    }
}

// Create falling balls
function createBall() {
    const trackIndex = Math.floor(Math.random() * 3) + 1;
    const track = document.querySelector(`.track${trackIndex} .balls`);
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.style.background = getRandomColor();
    track.appendChild(ball);

    let ballTop = 0;

    function moveBall() {
        ballTop += ballSpeed;
        ball.style.top = `${ballTop}px`;

        if (ballTop > track.clientHeight) {
            track.removeChild(ball);
            missedBalls++;
            updateLives();
        } else if (checkCollision(ball, trackIndex)) {
            track.removeChild(ball);
            score++;
            scoreDisplay.textContent = score;
            updateBallSpeed();
        }
    }

    const ballIntervalId = setInterval(moveBall, 20);
    ballIntervals.push(ballIntervalId);
}

// Random color
function getRandomColor() {
    const colors = ["red", "green", "blue", "yellow", "purple"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createBalls() {
    intervalId = setInterval(() => {
        createBall();
    }, createIntensity);
}

// End the game a
function endGame() {
    finalScoreDisplay.textContent = score;
    gameOverCard.style.display = "block";
    clearInterval(intervalId); // Stop ball creation
    gameStarted = false;

    ballIntervals.forEach(interval => clearInterval(interval));
    ballIntervals = []; // Reset the intervals array
}

// Reset game
function resetGame() {
    missedBalls = 0;
    score = 0;
    scoreDisplay.textContent = score;
    updateLives();
    gameOverCard.style.display = "none";
    currentBasketIndex = 1;
    updateBasketVisibility();

    document.querySelectorAll('.balls').forEach(track => {
        track.innerHTML = '';
    });
}
function updateLives() {
    for (let i = 0; i < lives.length; i++) {
        lives[i].style.backgroundColor = i < (2 - missedBalls) ? 'red' : 'gray';
    }

    if (missedBalls >= 2) {
        endGame();
    }
}

function handleLeftClick() {
    if (gameStarted) {
        currentBasketIndex = Math.max(currentBasketIndex - 1, 0);
        updateBasketVisibility();
    }
}


function handleRightClick() {
    if (gameStarted) {
        currentBasketIndex = Math.min(currentBasketIndex + 1, 2);
        updateBasketVisibility();
    }
}

// Check if ball collides with the basket
function checkCollision(ball, trackIndex) {
    const basket = document.querySelector(`.basket-${trackIndex}`);
    const ballRect = ball.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    const isTouchingTop = ballRect.bottom >= basketRect.top && ballRect.top < basketRect.top;
    const isAlignedWithBasket = ballRect.left >= basketRect.left && ballRect.right <= basketRect.right;

    return isTouchingTop && isAlignedWithBasket;
}

// Event listeners for basket
leftBtn.addEventListener("click", handleLeftClick);
rightBtn.addEventListener("click", handleRightClick);

document.addEventListener('keydown', (event) => {
    if (gameStarted) {
        switch (event.key) {
            case 'ArrowLeft':
                handleLeftClick();
                break;
            case 'ArrowRight':
                handleRightClick();
                break;
        }
    }
});

playAgainBtn.addEventListener("click", () => {
    resetGame();
    startGame();
});