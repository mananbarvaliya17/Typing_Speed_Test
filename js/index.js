const TOTAL_ROUNDS = 10;  
const TIME_PER_ROUND = 4;    

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

let letters = [];   
let results = [];   
let round = 0;     
let startTime;         
let roundTimer;        

const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const charLetter = document.getElementById('charLetter');
const charInput = document.getElementById('charInput');
const roundNum = document.getElementById('roundNum');
const dotsWrap = document.getElementById('dots');
const feedback = document.getElementById('feedback');
const timerBar = document.getElementById('timerBar');
const resCorrect = document.getElementById('resCorrect');
const resWrong = document.getElementById('resWrong');
const resTime = document.getElementById('resTime');
const accFill = document.getElementById('accFill');
const accLabel = document.getElementById('accLabel');
const resultTitle = document.getElementById('resultTitle');
const btnRestart = document.getElementById('btnRestart');


function generateLetters() {
    letters = [];
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
        const randomIndex = Math.floor(Math.random() * ALPHABET.length);
        letters.push(ALPHABET[randomIndex]);
    }
}


function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dotsWrap.appendChild(dot);
    }
}


function showLetter(index) {
    charLetter.classList.remove('pop');
    void charLetter.offsetWidth;
    charLetter.classList.add('pop');
    charLetter.textContent = letters[index].toUpperCase();

    roundNum.textContent = index + 1;

    const allDots = dotsWrap.querySelectorAll('.dot');
    allDots.forEach((d, i) => d.classList.toggle('active', i === index));

    clearInterval(roundTimer);
    timerBar.style.transform = 'scaleX(1)';
    let timeLeft = TIME_PER_ROUND;

    roundTimer = setInterval(() => {
        timeLeft -= 0.05;
        timerBar.style.transform = `scaleX(${Math.max(0, timeLeft / TIME_PER_ROUND)})`;
        if (timeLeft <= 0) {
            clearInterval(roundTimer);
            recordAnswer(false);   
        }
    }, 50);
}

charInput.addEventListener('input', (e) => {
    const typed = e.target.value.trim().toLowerCase();
    if (!typed || round >= TOTAL_ROUNDS) return;

    const isCorrect = (typed === letters[round]);
    recordAnswer(isCorrect);
});


function recordAnswer(isCorrect) {
    clearInterval(roundTimer);
    results.push(isCorrect);

    const allDots = dotsWrap.querySelectorAll('.dot');
    allDots[round].classList.remove('active');
    allDots[round].classList.add(isCorrect ? 'correct' : 'wrong');

    charInput.value = '';
    charInput.classList.add(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => charInput.classList.remove('correct', 'wrong'), 400);

    feedback.textContent = isCorrect ? '✓ CORRECT' : '✗ WRONG';
    feedback.className = 'feedback show ' + (isCorrect ? 'ok' : 'err');
    setTimeout(() => { feedback.className = 'feedback'; }, 500);

    round++;

    if (round < TOTAL_ROUNDS) {
        setTimeout(() => showLetter(round), 400);
    } else {
        setTimeout(showResults, 600);
    }
}


function showResults() {

    clearInterval(roundTimer);

    const timeTaken = ((new Date() - startTime) / 1000).toFixed(1);
    const correct = results.filter(r => r === true).length;
    const wrong = TOTAL_ROUNDS - correct;
    const accuracy = Math.round((correct / TOTAL_ROUNDS) * 100);

    gameScreen.style.display = 'none';
    resultScreen.classList.add('show');

    resultTitle.textContent =
        accuracy === 100 ? 'PERFECT!' :
            accuracy >= 70 ? 'GREAT JOB' : 'KEEP GOING';

    resCorrect.textContent = correct;
    resWrong.textContent = wrong;
    resTime.textContent = timeTaken + 's';

    accLabel.textContent = accuracy + '%';
    requestAnimationFrame(() => { accFill.style.width = accuracy + '%'; });

}


function startGame() {
    round = 0;
    results = [];

    gameScreen.style.display = 'flex';
    resultScreen.classList.remove('show');
    charInput.value = '';
    feedback.className = 'feedback';
    timerBar.style.transform = 'scaleX(1)';

    generateLetters();
    buildDots();

    startTime = new Date();
    charInput.focus();
    showLetter(0);
}

btnRestart.addEventListener('click', startGame);
startGame();