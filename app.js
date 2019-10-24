
const gridBoard = document.querySelector('.grid-board');

const alert = document.querySelector('.alert');

// all about score board
const gameInfo = document.querySelector('.game-info');
let gameInfoValues = {
    time: 0,
    correct: 0,
    incorrect: 0,
    score: 0
}
const timeInfo = gameInfo.querySelector('.time');
const correctInfo = gameInfo.querySelector('.correct');
const incorrectInfo = gameInfo.querySelector('.incorrect');
const scoreInfo = gameInfo.querySelector('.score');
timeInfo.innerHTML = `Time: 0`;
updateGameValues();


const startButton = document.querySelector('.button--start');
startButton.addEventListener('click', newGame);

let numberOfPairs, timeForGame, fields;

let timer;

let lastClicked = {};

const icons = ['fa-cat',
    'fa-tshirt',
    'fa-bacon',
    'fa-guitar',
    'fa-car-side',
    'fa-bowling-ball',
    'fa-heart',
    'fa-ghost',
    'fa-bomb',
    'fa-tree',
    'fa-trophy',
    'fa-lemon'];

const colors = [
    '#F1D334',
    '#00A6A6',
    '#82FF9E',
    '#EFF2C0',
    '#B8336A',
    '#CF5C36',
    '#42F2F7',
    '#D72638',
    '#3F88C5',
    '#F6E4F6',
    '#CC3363',
    '#F7B05B'
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function newGame() {
    numberOfPairs = document.getElementById('pairs-select').value;
    timeForGame = document.getElementById('time-select').value;

    // reset stats for new game
    gameInfoValues.time = 0;
    gameInfoValues.correct = 0;
    gameInfoValues.incorrect = 0;
    gameInfoValues.score = 0;
    updateGameValues();
    clearInterval(timer);

    selectGridPattern(+numberOfPairs, gridBoard);
    createGridFields(+numberOfPairs, gridBoard);

    gameInfo.classList.remove('hidden');
    alert.classList.remove('alert--victory');
    alert.classList.remove('alert--defeat');
    alert.classList.remove('alert--welcome');

    fields = gridBoard.querySelectorAll('.field');
    fields.forEach(field => field.addEventListener('click', fieldClick));
    time();

}

function updateGameValues(){
    correctInfo.innerHTML = `Correct: ${gameInfoValues.correct}`;
    incorrectInfo.innerHTML = `Incorrect: ${gameInfoValues.incorrect}`;
    scoreInfo.innerHTML = `Score: ${gameInfoValues.score}`;
}

function time() {
    timer = setInterval(() => {
        gameInfoValues.time++;
        timeInfo.innerHTML = `Time: ${gameInfoValues.time}`;
        if(gameInfoValues.time == timeForGame){
            clearInterval(timer);
            fields.forEach(field => field.removeEventListener('click', fieldClick));
            alert.innerHTML = `Czas minął! Twój wynik to: ${gameInfoValues.score}`;
            alert.classList.add('alert--defeat');
        }
    }, 1000);
}

function fieldClick() {
    if (Object.keys(lastClicked).length === 0) {
        this.classList.remove('no-animation');
        this.classList.add('flipped');
        lastClicked.name = this;
        lastClicked.iconClass = this.querySelector('i').classList.value;
    }
    else {
        this.classList.remove('no-animation');
        this.classList.add('flipped');

        // check if they have the same class for 'i'
        if (this.querySelector('i').classList.value === lastClicked.iconClass) {
            gameInfoValues.correct ++;
            // remove click event listeners
            this.removeEventListener('click', fieldClick);
            lastClicked.name.removeEventListener('click', fieldClick);

            // animation of correct guess
            const first = this;
            const second = lastClicked.name;

            const color = colors[getRandomInt(0, 11)];

            setTimeout(() => {
                first.classList.add('guessed');
                second.classList.add('guessed');
                first.querySelector('.field__face--back').style.backgroundColor = color;
                second.querySelector('.field__face--back').style.backgroundColor = color;
            }, 500); // after .5s sets classes and changes color

            lastClicked = {}; // make lastClicked empty
        }
        else {
            gameInfoValues.incorrect++;
            const that = this;
            fields.forEach(field => field.removeEventListener('click', fieldClick));
            setTimeout(() => {
                that.classList.remove('flipped');
                lastClicked.name.classList.remove('flipped');
                lastClicked = {};
                fields.forEach(field => field.addEventListener('click', fieldClick));
            }, 1000);
        }

        //gameInfoValues.score = Math.round(((gameInfoValues.correct * 2000 - gameInfoValues.incorrect * 200)/+timeForGame)*100)/100;
        gameInfoValues.score = gameInfoValues.correct * 2000 - gameInfoValues.incorrect * 200;
        updateGameValues();

        //win
        if (gameInfoValues.correct === +numberOfPairs) {
            gameInfoValues.score = Math.round((gameInfoValues.score + 10000/+timeForGame)*100)/100;
            updateGameValues();
            alert.innerHTML = `Wygrałeś! Twój wynik to: ${gameInfoValues.score}`;
            alert.classList.add('alert--victory');
            clearInterval(timer);
        }
    }
}

function selectGridPattern(numberOfPairs, gridBoard) {
    gridBoard.classList.remove(...gridBoard.classList);
    gridBoard.classList.add('grid-board');

    if (numberOfPairs === 2) {
        gridBoard.classList.add('two-columns-board');
    }
    else if (numberOfPairs <= 8) {
        gridBoard.classList.add('four-columns-board');
    }
    else if (numberOfPairs === 10) {
        gridBoard.classList.add('five-columns-board');
    }
    else {
        gridBoard.classList.add('six-columns-board');
    }
}

function createGridFields(numberOfPairs, gridBoard) {

    const numberOfFields = numberOfPairs * 2;
    const randomArray = randomArrayGenerator(numberOfFields);
    gridBoard.innerHTML = createGridHTML(randomArray);

}

function randomArrayGenerator(number) {
    let arr = new Array(number);
    let i, j;

    for (i = 0, j = 0; i < arr.length; i += 2, j++) {
        arr[i] = icons[j];
        arr[i + 1] = icons[j];
    }
    shuffleArray(arr);
    return arr;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

function createGridHTML(array) {
    return array.map(e => `<div class="scene">
        <div class="field no-animation">
        <div class="field__face field__face--front"></div>
        <div class="field__face field__face--back"><i class="fas ${e}"></i></div>
        </div>
        </div>`)
        .join('');
}
