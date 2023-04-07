const toggleListeningButton = document.getElementById('toggleListening');
const statusElement = document.getElementById('status');
const wordsListenedElement = document.getElementById('wordsListened');
const targetWordInput = document.getElementById('targetWord');
const targetWord = 'podóloga';
let wordCounter = {};

let isListening = false;
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'es-ES';
  recognition.addEventListener('result', onResult);
  recognition.addEventListener('error', onError);
} else {
  statusElement.textContent = 'Speech recognition is not supported in this browser.';
}

function onResult(event) {
  const targetWord = targetWordInput.value.trim();
  if (!targetWord) {
    return;
  }

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const words = event.results[i][0].transcript.trim().split(/\s+/);
    words.forEach((word) => {
      wordCounter[word] = (wordCounter[word] || 0) + 1;
      if (word === targetWord && wordCounter[word] === 3) {
        notificationSound.play();
        wordCounter[word] = 0;
      }
    });
  }
  // Update the wordsListenedElement to display the listened words and their counts with highlights
  wordsListenedElement.innerHTML = '<ul>' + Object.entries(wordCounter)
    .map(([word, count]) => {
      const wordDisplay = word === targetWord && count === 3 ? `<mark>${word}</mark>` : word;
      return `<li>${wordDisplay}: ${count}</li>`;
    })
    .join('') + '</ul>';
}

function onError(error) {
    if (error.error === 'not-allowed') {
      statusElement.textContent = 'Microphone access is not allowed.';
    } else if (error.error === 'no-speech') {
      statusElement.textContent = 'No speech was detected.';
    } else if (error.error === 'audio-capture') {
      statusElement.textContent = 'No microphone was found.';
    } else {
      statusElement.textContent = `Speech recognition error: ${error.error}`;
    }
    console.error('Speech recognition error:', error);
  }

toggleListeningButton.addEventListener('click', () => {
  if (!recognition) {
    return;
  }

  if (isListening) {
    recognition.stop();
    toggleListeningButton.textContent = 'Start Listening';
    statusElement.textContent = '';
  } else {
    recognition.start();
    toggleListeningButton.textContent = 'Stop Listening';
    statusElement.textContent = 'Listening...';
  }

  isListening = !isListening;
});
