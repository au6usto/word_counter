const toggleListeningButton = document.getElementById('toggleListening');
const statusElement = document.getElementById('status');
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
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const words = event.results[i][0].transcript.trim().split(/\s+/);
    words.forEach((word) => {
      wordCounter[word] = (wordCounter[word] || 0) + 1;
      if (word === targetWord && wordCounter[word] === 3) {
        alert(`You have said the word '${targetWord}' 3 times.`);
        wordCounter[word] = 0;
      }
    });
  }
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
