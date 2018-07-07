/*
 * Create a list that holds all of your cards
 */
const deckOfCards = [
    'fa-dolly',
    'fa-dolly',
    'fa-flask',
    'fa-flask',
    'fa-couch',
    'fa-couch',
    'fa-glasses',
    'fa-glasses',
    'fa-people-carry',
    'fa-people-carry',
    'fa-robot',
    'fa-robot',
    'fa-rocket',
    'fa-rocket',
    'fa-user-astronaut',
    'fa-user-astronaut'
];

//global variables
let pickedCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const deck = document.querySelector('.deck');
const cards = document.querySelector('.card');
const pairs = 8;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//shuffle the cards
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffleCards = shuffle(cardsToShuffle);
//when you shuffle flip all cards back to backside, removing all shown, open, and currently matched
    for (card of shuffleCards) {
        card.classList.remove('show');
        card.classList.remove('open');
        card.classList.remove('match');
        deck.appendChild(card);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Event Listener on click flips cards over, creates match or flips non-matches back over

deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (clickTarget.classList.contains('card') && 
        !clickTarget.classList.contains('match') && 
        //makes sure to only check 2 cards at a time
        pickedCards.length < 2 &&
       !pickedCards.includes(clickTarget) 
        ) {
        pickCard(clickTarget);
        addPickedCard(clickTarget);
        //checks the two cards for match, if a match is made, adds to move count
        if (pickedCards.length === 2){
           setTimeout(checkForMatch, 800);
            addMove();
            checkScore();
            }
        }
        if (clockOff) {
            startClock();
            clockOff = false;
        }
    });

function pickCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addPickedCard(clickTarget) {
    pickedCards.push(clickTarget);
    console.log(pickedCards);
}

//timer start and stop

function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
        console.log(time);
        }, 1000);
}

function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    clock.innerHTML = time;
    //show time in correct manner of 0:00, after 60 seconds, add 1 to minutes, etc as time goes on
    if(seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`; 
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

function stopClock() {
    clearInterval(clockId);
}

//add moves
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

//remove stars based on move counts
function checkScore() {
    if(moves === 14 || moves === 21){
        hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList){
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

//Looking for cards to match!

function checkForMatch() {
    if (
        pickedCards[0].firstElementChild.className ===
        pickedCards[1].firstElementChild.className
    ) {
        pickedCards[0].classList.toggle('match');
        pickedCards[1].classList.toggle('match');
        pickedCards = [];
        matched++;
        //once 8 matches are over run function gameOver
        if (matched === 8) {
            gameOver();
        } 
    } else {
        console.log('Not a match!');
        pickCard(pickedCards[0]);
        pickCard(pickedCards[1]);
        pickedCards = [];
    }
}

//modal

function openModal() {
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('hide');
}

//write out stats in modal pops up when gameOver function is run
function writeModalStats() {
    const timeStat = document.querySelector('.modal-time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal-moves');
    const starsStat = document.querySelector('.modal-stars');
    const stars = getStars();
    
    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

//show star count at end of game in stats
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    console.log(starCount);
    return starCount;
}

document.querySelector('.modal-cancel').addEventListener('click', () => {
    openModal();
});
                                                      
//reset the game
function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function replayGame() {
    resetGame();
    openModal();
}
        
document.querySelector('.restart').addEventListener('click', resetGame);

document.querySelector('.modal-replay').addEventListener('click', replayGame);

if (matched === pairs) {
   gameOver();
}

function gameOver() {
    stopClock();
    openModal();
    writeModalStats();
}