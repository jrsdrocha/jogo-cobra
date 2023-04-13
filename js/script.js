/* grid-area is a shorthand property that sets values for grid items start and end lines for both row and column */

const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let foodX, foodY;
let gameOver = false;
let snakeBody = [];
let snakeX = 1, snakeY = 1;
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

//Getting hight socore from the local storage
let hightScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${hightScore}`;

// passing a random 0 - 30 value as food positions 

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

//Clearing the time and reloading the page on game over
const handleChangeGameOver = () => {
    clearInterval(setIntervalId);
    alert('Game Over! Press Ok to replay...')
    location.reload();
};

// change velocity value based on key press

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

controls.forEach(key => {
    //Calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener('click', () => changeDirection({ key: key.dataset.key }));
});

const initGame = () => {

    if (gameOver) return handleChangeGameOver();
    let htmlMarkKup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`
    playBoard.innerHTML = htmlMarkKup;

    //Checking is the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //pushing foo position to snake body array
        score++; // increment score by 1

        hightScore = score >= hightScore ? score : hightScore;
        localStorage.setItem('high-score', hightScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${hightScore}`
    };

    for (let i = snakeBody.length - 1; i > 0; i--) {

        //shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    };

    snakeBody[0] = [snakeX, snakeY]; //setting frist element of snake body to current snake position

    //Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //checking if the snake's head is out of wall, if so setting gameOver to true.
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    };

    //adding a div for each part of the snake's body
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkKup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        //checking if the snake head hit the bady, is so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        };
    };
    playBoard.innerHTML = htmlMarkKup;

};


changeFoodPosition();
setIntervalId = setInterval(initGame, 90);
document.addEventListener('keydown', changeDirection);