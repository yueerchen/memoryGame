// css class for different card image
const CARD_TECHS = [
    'html5',
    'css3',
    'js',
    'sass',
    'nodejs',
    'react',
    'linkedin',
    'heroku',
    'github',
    'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
    score: 0,
    level: 1,
    timer: 60,
    timerDisplay: null,
    scoreDisplay: null,
    levelDisplay: null,
    timerInterval: null,
    startButton: null,
    // and much more
    barWidth: 100,
    levelOneSet: [],
    levelTwoSet: [],
    levelThreeSet: [],
    lastCard: null,
    currentCard: null
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
    // set card set
    var set = [];
    for (var i = 0; i < 10; i++) {
        set.push(CARD_TECHS[i]);
        set.push(CARD_TECHS[i]);
    }
    for (var i = 0; i < 8; i++) {
        set.push(CARD_TECHS[i]);
        set.push(CARD_TECHS[i]);
    }
    game.levelOneSet = set.slice(0, 4);
    game.levelTwoSet = set.slice(0, 16);
    game.levelThreeSet = set;
    shuffle(game.levelOneSet);
    shuffle(game.levelTwoSet);
    shuffle(game.levelThreeSet);
    // register any element in your game object
    bindStartButton();
}

function startGame() {
    // Initialization
    game.score = 0;
    game.level = 1;
    game.timer = 60;
    game.barWidth = 100;
    updateLevelDisplay();
    document.querySelector('.game-stats__score--value').innerHTML = "0";
    document.querySelector('.game-timer__bar').innerHTML = "60s";
    document.getElementsByClassName('game-timer__bar')[0].removeAttribute("style");
    // add cards to the game board
    createCard(1);
    // start the timer
    game.timerInterval = setInterval(updateTimerDisplay, 1000);
    bindCardClick();
}

function createCard(level) {
    // clear game board
    var gameBoard = document.querySelector('.game-board');
    var boardElement = document.getElementsByClassName('game-board');
    gameBoard.innerHTML = '';
    // set game board style
    var row = level * 2;
    var rowString = ' 1fr'.repeat(row);
    boardElement[0].setAttribute("style", "grid-template-columns:" + rowString + ";");
    // 1*2,2*2,3*2 level 1: 4 level 2: 16 level 3: 36
    var cardNumber = row * row;
    var cardSet;
    if (level === 1) {
        cardSet = game.levelOneSet;
    } else if (level === 2) {
        cardSet = game.levelTwoSet;
    } else if (level === 3) {
        cardSet = game.levelThreeSet;
    }
    for (var i = 0; i < cardNumber; i++) {
        var div = document.createElement('div');
        gameBoard.appendChild(div).setAttribute("class", "card " + cardSet[i]);
        gameBoard.children[i].setAttribute("data-tech", cardSet[i]);
        var divFront = document.createElement('div');
        var divBack = document.createElement('div');
        gameBoard.children[i].appendChild(divFront).setAttribute("class", "card__face card__face--front");
        gameBoard.children[i].appendChild(divBack).setAttribute("class", "card__face card__face--back");
    }
}

var clickHandler = function(event) {
    var target = event.target;
    var currentCard = target.parentNode;
    var cardNumber = (game.level * 2) * (game.level * 2);
    if (!currentCard.classList.contains('card')) {
        return;
    }
    if (currentCard.classList.contains('card--flipped')) {
        return;
    }
    if (game.lastCard != null && game.lastCard != currentCard) {
        currentCard.classList.add('card--flipped');
        game.currentCard = currentCard;
        var currentType = currentCard.getAttribute('data-tech');
        var lastType = game.lastCard.getAttribute('data-tech');
        if (currentType != lastType) {
            unBindCardClick();
            setTimeout(handleCardFlip, 2000);
        } else {
            game.lastCard = null;
            updateScore();
        }
    } else {
        currentCard.classList.add('card--flipped');
        game.lastCard = currentCard;
    }
    var flippedCard = document.getElementsByClassName('card--flipped').length;
    // test all card flipped
    if (cardNumber === flippedCard) {
        setTimeout(nextLevel, 2000);
    }
}

function handleCardFlip() {
    game.currentCard.classList.remove('card--flipped');
    game.lastCard.classList.remove('card--flipped');
    game.lastCard = null;
    bindCardClick();
}

function nextLevel() {
    game.level += 1;
    var level = game.level;
    if (level > 3) {
        handleGameOver();
        return;
    } else {
        // reset time bar
        game.timer = 60;
        game.barWidth = 100;
        document.querySelector('.game-timer__bar').innerHTML = "60s";
        document.getElementsByClassName('game-timer__bar')[0].removeAttribute("style");
        // pause and set the timer
        clearInterval(game.timerInterval);
        //start tick
        game.timerInterval = setInterval(updateTimerDisplay, 1000);
        // set game board
        createCard(level);
        updateLevelDisplay();
    }
}

function handleGameOver() {
    var statusButton = document.querySelector('.game-stats__button');
    alert("Congratulations, your score is " + game.score);
    clearInterval(game.timerInterval);
    unBindCardClick();
    statusButton.innerHTML = 'Start Game';
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
    var scoreDisplay = document.querySelector('.game-stats__score--value');
    // current score
    var score = game.score;
    // score to add
    var scoreToAdd = game.timer;
    // update score
    score += scoreToAdd;
    game.score = score;
    game.scoreDisplay = '' + score;
    scoreDisplay.innerHTML = game.scoreDisplay;
}

function updateTimerDisplay() {
    var time = game.timer;
    if (time > 0) {
        // update time
        time -= 1;
        game.timer = time;
        // update time display
        var timeDisplay = document.querySelector('.game-timer__bar');
        var timeBar = document.getElementsByClassName('game-timer__bar');
        timeDisplay.innerHTML = "" + time + "s";
        // update time bar
        game.barWidth -= (5 / 3);
        var barStyle = "width:" + game.barWidth.toFixed(4) + "%;"
        timeBar[0].setAttribute("style", barStyle);
    } else {
        handleGameOver();
    }
}

function updateLevelDisplay() {
    var levelDisplay = document.querySelector('.game-stats__level--value');
    levelDisplay.innerHTML = '' + game.level;
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
    var statusButton = document.querySelector('.game-stats__button');
    statusButton.addEventListener('click', function(event) {
        var status = statusButton.innerHTML;
        if (status === 'New Game') {
            statusButton.innerHTML = 'End Game';
            startGame();
        } else if (status === 'End Game') {
            handleGameOver();
        } else if (status === 'Start Game') {
            startGame();
            statusButton.innerHTML = 'End Game';
        }
    });
}

function unBindCardClick() {
    var gameBoard = document.querySelector('.game-board');
    gameBoard.removeEventListener('click', clickHandler, false);
}

function bindCardClick() {
    var gameBoard = document.querySelector('.game-board');
    gameBoard.addEventListener('click', clickHandler, false);
}