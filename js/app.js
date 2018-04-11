// Evaluate the open cards
function isMatch(cabt) {
  moves = moves + 1;
  changeMoves(moves);
  let image1 = cabt[0].querySelector('img');
  let image2 = cabt[1].querySelector('img');
  if (image1.src == image2.src) {
    return true;
  } else {
    return false;
  }
}

// Cards match, let's keep them open
function setMatch(cabt) {
  cabt[0].classList.remove('closed');
  cabt[0].classList.remove('open');
  cabt[0].classList.toggle('solved');
  cabt[1].classList.remove('closed');
  cabt[1].classList.remove('open');
  cabt[1].classList.toggle('solved');
  openCards = [];
  evaluating = false;

  solvedAmount = solvedAmount + 1;
  setTimeout(function() {
    if (solvedAmount == MAX_SOLVED) {
      clearInterval(intervalID);
      finishTheGame();
    }
  }, TIMEOUT_ALERT);
}

// Close both cards since they do not match
function closeBoth(cabt) {
  cabt[0].classList.toggle('closed');
  cabt[0].classList.toggle('open');
  cabt[1].classList.toggle('closed');
  cabt[1].classList.toggle('open');
  let image1 = cabt[0].querySelector('img');
  let image2 = cabt[1].querySelector('img');
  image1.style.display = 'none';
  image2.style.display = 'none';
  openCards = [];
  evaluating = false;
}

// Open the win modal
function openModal() {
  MODAL.style.display = 'block';
}

// Close the win modal
function closeModal() {
  MODAL.style.display = 'none';
}

// Tick for game timer
function tick() {
  let hr = '';
  let mn = '';
  let sc = '';
  time = time + 1;

  if (time > 59) {
    sec = time % 60;
    min = (time - sec) / 60;
    if (min > 59) {
      min = min % 60;
      hou = (time - min * 60) / 60;
    }
  } else {
    sec = time;
  }

  if (hou < 10) {
    hr = '0';
  }
  if (min < 10) {
    mn = '0';
  }
  if (sec < 10) {
    sc = '0';
  }

  auxTime = hr + hou + "h:" + mn + min + "m:" + sc + sec + "s";
  TIMER.innerHTML = auxTime;
}

// The timer starts running
function startTimer() {
  intervalID = setInterval(tick, 1000);
}

// Open the card to show the image
function openCard(image, card) {
  image.style.display = 'flex';
  openCards.push(card);
  card.classList.toggle('closed');
  card.classList.toggle('open');
}

// Shuffle for an array
// Source: https://stackoverflow.com/a/6274381/7426526
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Assign the images to the cards
function shuffleCards(cardList, imagesList) {
  let imgTags = [];
  for (let card of cardList) {
    imgTags.push(card.querySelector('img'));
  }
  shuffle(imagesList);
  let index = 0;
  for (let img of imgTags) {
    img.src = imagesList[index];
    index = index + 1;
  }
}

// Change moves number
function changeMoves(num) {
  MOVES.innerHTML = num + " moves"
  if (num > 10) {
    stars = 2;
    STAR_FIRST.style.display = 'none';
  }
  if (num > 20) {
    stars = 1;
    STAR_SECOND.style.display = 'none';
  }
  if (num > 30) {
    stars = 0;
    STAR_THIRD.style.display = 'none';
  }
}

// Custom generic click for all cards
function performCustomClick(card) {
  /*
  I was having a problem with images being selected after firing a click on
  them in Mozilla browser, so the next few lines are used to clear any
  selection made by the user
  Source:
  https://developer.mozilla.org/en-US/docs/Web/API/Selection
  */
  if (window.getSelection) {
    if (window.getSelection().empty) { // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) { // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) { // IE?
    document.selection.empty();
  }

  /*
  If the card is closed, and there is no evaluation in progress (2 different
  open cards), we can start the process
   */
  if (!card.classList.contains('solved') &&
    !card.classList.contains('open') && !evaluating) {
    //We open the card if it's closed
    let image = card.querySelector('img');
    if (card.classList.contains('closed')) {
      openCard(image, card)
    }
    //We evaluate the cards if there are 2 of them open
    if (openCards.length == 2) {
      evaluating = true;
      if (!isMatch(openCards)) {
        // If they don't match, we give the user 1 second to see and keep
        // track of them
        setTimeout(function() {
          closeBoth(openCards);
        }, TIMEOUT_CLOSE);
      } else {
        setMatch(openCards);
      }
    }
  }

  if (!firstClickMade) {
    firstClickMade = true;
    startTimer();
  }
}

// Victory method
function finishTheGame() {
  openModal();
  MODAL_TIME.innerHTML = "Juego finalizado en: " + auxTime;
  MODAL_MOVES.innerHTML = "Movimientos realizados: " + moves;
  if (stars < 3) {
    MODAL_STAR_FIRST.style.display = 'none';
  }
  if (stars < 2) {
    MODAL_STAR_SECOND.style.display = 'none';
  }
  if (stars < 1) {
    MODAL_STAR_THIRD.style.display = 'none';
  }
}

// Resets the game to its original state
function reset() {
  for (let card of CARDS) {
    card.classList.remove('closed');
    card.classList.remove('open');
    card.classList.remove('solved');
    let img = card.querySelector('img');
    img.style.display = 'none';
    card.classList.toggle('closed');
  }
  shuffleCards(CARDS, MATCHING_IMAGES);
  auxTime = "";
  time = 0;
  sec = 0;
  min = 0;
  hou = 0;
  openCards = [];
  solvedAmount = 0;
  evaluating = false;
  firstClickMade = false;
  moves = 0;
  stars = 3;
  changeMoves(moves);
  TIMER.innerHTML = "00h:00m:00s";
  STAR_FIRST.style.display = '';
  STAR_SECOND.style.display = '';
  STAR_THIRD.style.display = '';
}

const CARDS = document.querySelectorAll('div.card');
const MATCHING_IMAGES = [
  "img/sasel1.png", "img/sasel1.png", "img/sasel2.png", "img/sasel2.png",
  "img/sasel3.png", "img/sasel3.png", "img/sasel4.png", "img/sasel4.png",
  "img/sasel5.png", "img/sasel5.png", "img/sasel6.png", "img/sasel6.png",
  "img/sasel7.png", "img/sasel7.png", "img/sasel8.png", "img/sasel8.png"
];
const TIMEOUT_CLOSE = 1000;
const TIMEOUT_ALERT = 300;
const MAX_SOLVED = 8;

const MODAL = document.querySelector('#modal');
const MODAL_TIME = document.querySelector('#modal-time');
const MODAL_MOVES = document.querySelector('#modal-moves');
const MODAL_PLAY = document.querySelector('#modal-btn-play');
const MODAL_CLOSE = document.querySelector('#modal-btn-close');
const MODAL_STAR_FIRST = document.querySelector('#modal-star-first');
const MODAL_STAR_SECOND = document.querySelector('#modal-star-second');
const MODAL_STAR_THIRD = document.querySelector('#modal-star-third');
const STAR_FIRST = document.querySelector('#star-first');
const STAR_SECOND = document.querySelector('#star-second');
const STAR_THIRD = document.querySelector('#star-third');
const TIMER = document.querySelector('#stats-timer');
const MOVES = document.querySelector('#stats-moves');
const RESTART = document.querySelector('#restart-button');

MODAL_PLAY.addEventListener('click', function resetClick() {
  reset();
  closeModal();
});
MODAL_CLOSE.addEventListener('click', function resetClick() {
  closeModal();
});
RESTART.addEventListener('click', function resetClick() {
  reset();
});

let auxTime;
let openCards;
let solvedAmount;
let evaluating;
let firstClickMade;
let moves;
let stars;
let time;
let intervalID;
let sec;
let min;
let hou;
for (let card of CARDS) {
  card.addEventListener('click', function clickCard() {
    performCustomClick(card);
  });
}
reset();
