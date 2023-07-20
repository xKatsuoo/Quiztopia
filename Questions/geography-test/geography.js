let questions; // Globale Variable für Fragen
let questionsContainer = document.getElementById('questions-container');
let timer;

// Fragt den Benutzernamen ab
function getPlayerName() {
  const playerNameInput = document.getElementById('player-name-input');
  playerName = playerNameInput.value;
}

// Startet das Quiz
function startQuiz() {
  getPlayerName(); // Benutzernamen abfragen
  shuffleQuestions(questions);
  questions = questions.slice(0, 10); // Nur die ersten 10 Fragen verwenden

  resetTimer(); // Timer zurücksetzen
  showQuestion();
  startTimer(); // Timer für die erste Frage starten
}

// Zeigt das Player Name Container-Div an
function showPlayerNameContainer() {
  const playerNameContainer = document.getElementById('player-name-container');
  playerNameContainer.style.display = 'block';
}

// Blendet das Player Name Container-Div aus
function hidePlayerNameContainer() {
  const playerNameContainer = document.getElementById('player-name-container');
  playerNameContainer.style.display = 'none';
}

// Zeigt das Quiz Container-Div an
function showQuizContainer() {
  const quizContainer = document.getElementById('questions-container');
  quizContainer.style.display = 'block';
}

// Fragt den Benutzernamen ab und startet das Quiz
function handleStartQuiz() {
  getPlayerName(); // Benutzernamen abfragen
  startQuiz();
}

// Event Listener für den Button "Quiz starten"
document.getElementById('start-quiz-button').addEventListener('click', handleStartQuiz);

// Laden der Fragen aus der JSON-Datei
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data; // Speichern der Fragen in der globalen Variable
  })
  .catch(error => {
    console.error('Fehler beim Laden der Fragen:', error);
  });

let currentQuestionIndex = 0;
let score = 0;
let elapsedTime = 0; // Variable für die verstrichene Zeit in Sekunden
let playerName = ''; // Variable für den Benutzernamen
let quizEnded = false; // Variable für den Quiz-Endstatus

// Zeigt die aktuelle Frage und die Antwortmöglichkeiten an
function showQuestion() {
  const questionContainer = document.getElementById('question');
  const choicesContainer = document.getElementById('choices');
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.textContent = `Frage ${currentQuestionIndex + 1} von ${questions.length}: ${currentQuestion.question}`;

  // Erzeugen der Antwort-Buttons
  choicesContainer.innerHTML = '';
  currentQuestion.choices.forEach((choice, index) => {
    const choiceBtn = document.createElement('button');
    choiceBtn.textContent = choice;
    choiceBtn.setAttribute('data-index', index);
    choicesContainer.appendChild(choiceBtn);
  });
}

function checkAnswer(event) {
  const target = event.target;
  const selectedChoiceIndex = parseInt(target.getAttribute('data-index'));
  const currentQuestion = questions[currentQuestionIndex];
  const correctChoiceIndex = currentQuestion.answer;

  clearInterval(timer);

  if (selectedChoiceIndex === correctChoiceIndex) {
    score++;
    target.classList.add('correct');
  } else {
    target.classList.add('wrong');
    // Find the correct button and add the correct class to it to show it in green
    const correctButton = document.querySelector(`button[data-index="${correctChoiceIndex}"]`);
    correctButton.classList.add('correct');
  }

  // Disable further button clicks for this question
  const choiceButtons = document.querySelectorAll('#choices button');
  choiceButtons.forEach(button => {
    button.disabled = true;
  });

  // Move to the next question after a delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      resetTimer(); // Timer zurücksetzen
      showQuestion();
      startTimer(); // Timer für die nächste Frage starten

      // Remove the color classes from the buttons for the next question
      choiceButtons.forEach(button => {
        button.classList.remove('correct', 'wrong');
        button.disabled = false;
      });
    } else {
      endQuiz();
      saveHighscoreData(); // Speichern und Loggen der Highscore-Daten nach dem Quizende
    }
  }, 1500); // Adjust the delay as needed (2 seconds in this example)
}


// Startet den Timer für das Quiz
function startTimer() {
  const progressDisplay = document.getElementById('progress');
  let width = 0;

  timer = setInterval(() => {
    width += (100 / 15); // Progressbar füllt sich über 15 Sekunden
    progressDisplay.style.width = width + '%';

    elapsedTime++; // Verstrichene Zeit inkrementieren

    if (width >= 100) {
      clearInterval(timer);
      if (!quizEnded) { // Timer stoppen, wenn das Quiz noch nicht beendet ist
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          resetTimer(); // Timer zurücksetzen
          showQuestion();
          startTimer(); // Timer für die nächste Frage starten
        } else {
          endQuiz();
          saveHighscoreData(); // Speichern und Loggen der Highscore-Daten nach dem Quizende
        }
      }
    }
  }, 1000);
}

// Setzt den Timer zurück
function resetTimer() {
  clearInterval(timer);
  const progressDisplay = document.getElementById('progress');
  progressDisplay.style.width = '0%';
}

// Beendet das Quiz und zeigt die Ergebnisse an
function endQuiz() {
  clearInterval(timer);
  quizEnded = true; // Quiz-Endstatus auf true setzen
  const quizContainer = document.getElementById('quiz-container');
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const scoreboardLink = document.getElementById('scoreboard-link');
  scoreboardLink.style.display = 'inline';

  // Das Fragen-Div ausblenden
  questionsContainer.style.display = 'none';

  quizContainer.innerHTML = `
    <h1>Quiz beendet</h1>
    <p>Du hast ${score} von ${questions.length} Fragen richtig beantwortet.</p>
    <p>Benötigte Zeit: ${minutes} Minuten ${seconds} Sekunden.</p>
  `;
}

// Zufällige Reihenfolge der Fragen
function shuffleQuestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Event Listener für die Auswahl der Antwort
document.getElementById('choices').addEventListener('click', event => {
  const target = event.target;
  if (target.tagName === 'BUTTON') {
    checkAnswer(event);
  }
});

const MAX_HIGHSCORE_ENTRIES = 5; // Maximale Anzahl von Einträgen im Highscore

// Funktion zum Speichern und Loggen der Highscore-Daten
function saveHighscoreData() {
  let highscoreData = JSON.parse(localStorage.getItem('highscoreData'));

  if (!Array.isArray(highscoreData)) {
    highscoreData = [];
  }

  if (score === questions.length) {
    const newEntry = {
      category: 'Geographie',
      score: score,
      time: elapsedTime,
      name: playerName
    };

    highscoreData.push(newEntry);

    highscoreData.sort((a, b) => a.time - b.time); // Sortieren nach kürzester Zeit

    if (highscoreData.length > MAX_HIGHSCORE_ENTRIES) {
      highscoreData.splice(MAX_HIGHSCORE_ENTRIES); // Begrenzung der Anzahl der Einträge
    }

    localStorage.setItem('highscoreData', JSON.stringify(highscoreData));

    // Loggen der Highscore-Daten
    console.log('Highscore:');
    highscoreData.forEach(entry => {
      console.log('Name:', entry.name);
      console.log('Punktzahl:', entry.score);
      console.log('Benötigte Zeit:', Math.floor(entry.time / 60), 'Minuten', entry.time % 60, 'Sekunden');
      console.log('---');
    });
  }
}

// Laden der Highscore-Daten und Ausgabe des Highscores
function loadHighscoreData() {
  const highscoreData = JSON.parse(localStorage.getItem('highscoreData'));

  if (highscoreData && highscoreData.length > 0) {
    console.log('Highscore:');
    highscoreData.forEach(entry => {
      console.log('Name:', entry.name);
      console.log('Punktzahl:', entry.score);
      console.log('Benötigte Zeit:', Math.floor(entry.time / 60), 'Minuten', entry.time % 60, 'Sekunden');
      console.log('---');
    });
  } else {
    console.log('Es sind keine Highscore-Daten vorhanden.');
  }
}

// Beispiel für die Verwendung
// Nach dem Laden der Highscore-Daten:
loadHighscoreData();

console.log('Speicherort der Highscore-Daten:', localStorage);
