const MORSE_CODE_DICT = {
    'A': '.-',      'B': '-...',    'C': '-.-.',    'D': '-..',
    'E': '.',       'F': '..-.',    'G': '--.',     'H': '....',
    'I': '..',      'J': '.---',    'K': '-.-',     'L': '.-..',
    'M': '--',       'N': '-.',     'O': '---',     'P': '.--.',
    'Q': '--.-',    'R': '.-.',     'S': '...',     'T': '-',
    'U': '..-',     'V': '...-',    'W': '.--',     'X': '-..-',
    'Y': '-.--',    'Z': '--..',
    '1': '.----',   '2': '..---',   '3': '...--', 
    '4': '....-',   '5': '.....',   '6': '-....', 
    '7': '--...',   '8': '---..',   '9': '----.', 
    '0': '-----', 
    '.': '.-.-.-',  ',': '--..--',  '?': '..--..',  '!': '-.-.--',
    ' ': '/',
};

const REVERSE_DICT = Object.fromEntries(Object.entries(MORSE_CODE_DICT).map(([k, v]) => [v, k]));

let current;

function getRandomQuestion() {
    const entries = Object.entries(MORSE_CODE_DICT);
    let letter, morse;
    do {
        [letter, morse] = entries[Math.floor(Math.random() * entries.length)];
    } while (letter === ' ');
    if (Math.random() < 0.5) {
        current = { type: "letter", question: letter, answer: morse };
    } else {
        current = { type: "morse", question: morse, answer: letter };
    }
    document.getElementById('question').innerText =
        current.type === "letter"
            ? `Translate this character in Morse : ${current.question}`
            : `Translate this Morse in a character : ${current.question}`;
    document.getElementById('result').innerText = "";
    document.getElementById('answer').value = "";
}

function checkAnswer() {
    const input = document.getElementById('answer').value.trim();
    if (input === "") {
        document.getElementById('result').innerText = `⛔ The correct answer was : ${current.answer}`;
    } else if (
        input.toUpperCase() === current.answer.toUpperCase()
    ) {
        document.getElementById('result').innerText = "✅ Correct !";
        setTimeout(nextQuestion, 1000);
    } else {
        document.getElementById('result').innerText = "❌ Wrong. Try again.";
    }
}

function nextQuestion() {
    getRandomQuestion();
}

function playMorse() {
    const unit = 200;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const morse = current.type === "letter" ? current.answer : current.question;
    let time = context.currentTime;

    for (let char of morse) {
        if (char === '.') {
            beep(context, time, unit);
            time += unit / 1000 + 0.1;
        } else if (char === '-') {
            beep(context, time, unit * 3);
            time += (unit * 3) / 1000 + 0.1;
        } else if (char === ' ') {
            time += (unit * 3) / 1000;
        }
    }
}

function beep(context, startTime, duration) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 600;
    gain.gain.setValueAtTime(1, startTime);
    gain.gain.setValueAtTime(0, startTime + duration / 1000);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration / 1000);
}

function translateToMorse() {
    const text = document.getElementById('translation-input').value.toUpperCase();
    let morse = '';
    for (let char of text) {
        morse += MORSE_CODE_DICT[char] ? MORSE_CODE_DICT[char] + ' ' : '? ';
    }
    document.getElementById('translation-output').innerText = morse.trim();
    if (morse === '') document.getElementById('play-translated-morse').style.display = 'none';
    else  document.getElementById('play-translated-morse').style.display = 'inline-block';

}

function translateToText() {
    const morseInput = document.getElementById('translation-input').value.trim();
    const words = morseInput.split(' / ');
    let text = '';
    for (let word of words) {
        let letters = word.trim().split(' ');
        for (let symbol of letters) {
            text += REVERSE_DICT[symbol] || '?';
        }
        text += ' ';
    }
    document.getElementById('translation-output').innerText = text.trim();
    document.getElementById('play-translated-morse').style.display = 'none';

}

function playTranslatedMorse() {
    const morse = document.getElementById('translation-output').innerText.trim();
    if (!morse || morse === '?') {
        alert("No morse code to play.");
        return;
    }

    const unit = 200;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    let time = context.currentTime;

    for (let char of morse) {
        if (char === '.') {
            beep(context, time, unit);
            time += unit / 1000 + 0.1;
        } else if (char === '-') {
            beep(context, time, unit * 3);
            time += (unit * 3) / 1000 + 0.1;
        } else if (char === ' ') {
            time += (unit * 1) / 1000;
        } else if (char === '/') {
            time += (unit * 7) / 1000; // séparation entre mots
        }
    }
}

// Init
getRandomQuestion();

document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkAnswer();
    }
});
