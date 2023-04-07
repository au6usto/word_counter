const startStopButton = document.getElementById('startStop');
const statusElement = document.getElementById('status');
const wordsListenedElement = document.getElementById('wordsListened');
const targetWordInput = document.getElementById('targetWord');
const targetCountInput = document.getElementById('targetCount');
const notificationSound = document.getElementById('notificationSound');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let wordCounter = {};
let isListening = false;

recognition.onstart = () => {
  isListening = true;
  startStopButton.textContent = 'Detener';
  statusElement.textContent = 'Escuchando...';
  startStopButton.disabled = false;
};


recognition.onresult = (event) => {
  const targetWord = targetWordInput.value.trim().toLowerCase();
  const targetCount = parseInt(targetCountInput.value);

  const lastResult = event.results[event.results.length - 1];
  if (lastResult.isFinal) {
    const words = lastResult[0].transcript.trim().split(/\s+/);

    words.forEach((word) => {
      if (!word) {
        return;
      }

      word = word.toLowerCase();
      wordCounter[word] = (wordCounter[word] || 0) + 1;

      if (word === targetWord && wordCounter[word] === targetCount) {
        notificationSound.play();
        wordCounter[word] = 0;
      }
    });

    wordsListenedElement.innerHTML = '<ul>' + Object.entries(wordCounter)
      .map(([word, count]) => {
        const wordDisplay = word === targetWord && count === targetCount - 1 ? `<mark>${word}</mark>` : word;
        return `<li>${wordDisplay}: ${count}</li>`;
      })
      .join('') + '</ul>';
  }
};

recognition.onerror = (event) => {
  startStopButton.textContent = 'Comenzar';
  statusElement.textContent = `Error de reconocimiento de voz: ${event.error}`;
  startStopButton.disabled = false;
};

recognition.onend = () => {
  if (isListening) {
    recognition.start();
  } else {
    startStopButton.textContent = 'Comenzar';
    statusElement.textContent = 'Reconocimiento de voz detenido.';
    startStopButton.disabled = false;
  }
};

startStopButton.addEventListener('click', () => {
  if (isListening) {
    isListening = false;
    recognition.stop();
  } else {
    isListening = true;
    startStopButton.disabled = true;
    recognition.start();
  }
});
