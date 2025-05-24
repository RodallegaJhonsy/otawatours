document.addEventListener('DOMContentLoaded', () => {
    // --- Game Tab Switching ---
    const gameTabButtons = document.querySelectorAll('.game-tab-button');
    const gameContents = document.querySelectorAll('.game-content');

    window.showGame = (gameId) => { // Make it globally accessible from HTML onclick
        gameContents.forEach(content => content.classList.remove('active-game'));
        gameTabButtons.forEach(button => button.classList.remove('active'));

        document.getElementById(`${gameId}-game-section`).classList.add('active-game');
        document.querySelector(`.game-tab-button[onclick="showGame('${gameId}')"]`).classList.add('active');
    };

    // --- Memory Game ---
    const memoryBoard = document.getElementById('memory-board');
    const startMemoryGameBtn = document.getElementById('start-memory-game');
    const memoryMovesDisplay = document.getElementById('memory-moves');
    const memoryTimeDisplay = document.getElementById('memory-time');
    const memoryWinMessage = document.getElementById('memory-win-message');

    const memoryImages = [
    'assets/images/canada_flag.png',
    'assets/images/maple_leaf.png',
    'assets/images/beaver.png',
    'assets/images/mountie.png',
    'assets/images/niagara_falls.png',
    'assets/images/polar_bear.png'
];
    let memoryCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let memoryMoves = 0;
    let memoryTimer;
    let memorySeconds = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createMemoryBoard() {
        memoryBoard.innerHTML = '';
        memoryWinMessage.style.display = 'none';
        memoryCards = [];
        flippedCards = [];
        matchedPairs = 0;
        memoryMoves = 0;
        memorySeconds = 0;
        updateMemoryStats();

        const gameItems = shuffle([...memoryImages, ...memoryImages]); // Duplicate for pairs

        gameItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.item = item; // Guardamos la ruta en el dataset para la comparación

            // Create front and back of the card for flip animation
            const cardFaceFront = document.createElement('div');
            cardFaceFront.classList.add('card-face', 'card-front');
            cardFaceFront.textContent = '🏞️'; // Un ícono o un fondo para la parte frontal (cuando está volteada hacia abajo)

            const cardFaceBack = document.createElement('div');
            cardFaceBack.classList.add('card-face', 'card-back');
            
            // --- CAMBIO CLAVE AQUI ---
            const imgElement = document.createElement('img'); // Creamos un elemento <img>
            imgElement.src = item; // Asignamos la ruta de la imagen al atributo src
            imgElement.alt = 'Memory Card Image'; // Buena práctica para accesibilidad
            cardFaceBack.appendChild(imgElement); // Añadimos la imagen a la cara trasera de la carta
            // --- FIN DEL CAMBIO ---

            card.appendChild(cardFaceFront);
            card.appendChild(cardFaceBack);

            card.addEventListener('click', flipMemoryCard);
            memoryBoard.appendChild(card);
            memoryCards.push(card);
        });
        startMemoryTimer();
    }

    function flipMemoryCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                memoryMoves++;
                updateMemoryStats();
                checkForMemoryMatch();
            }
        }
    }

    function checkForMemoryMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.item === card2.dataset.item) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            if (matchedPairs === memoryImages.length) {
                clearInterval(memoryTimer);
                memoryWinMessage.style.display = 'block';
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
    
    function startMemoryTimer() {
        clearInterval(memoryTimer);
        memoryTimer = setInterval(() => {
            memorySeconds++;
            updateMemoryStats();
        }, 1000);
    }

    function updateMemoryStats() {
        memoryMovesDisplay.textContent = memoryMoves;
        memoryTimeDisplay.textContent = `${memorySeconds}s`;
    }

    if (startMemoryGameBtn) startMemoryGameBtn.addEventListener('click', createMemoryBoard);


    // --- Hangman Game ---
    const hangmanWordDisplay = document.getElementById('hangman-word-display');
    const hangmanLettersContainer = document.getElementById('hangman-letters');
    const startHangmanGameBtn = document.getElementById('start-hangman-game');
    const hangmanIncorrectGuessesDisplay = document.getElementById('hangman-incorrect-guesses');
    const hangmanMaxGuessesDisplay = document.getElementById('hangman-max-guesses');
    const hangmanFigure = document.getElementById('hangman-figure');
    const hangmanMessage = document.getElementById('hangman-message');


    const hangmanWords = ["CANADA", "TORONTO", "MAPLE", "MOOSE", "HOCKEY", "QUEBEC", "BANFF", "OTTAWA", "IGLOO", "BEAVER"];
    const maxIncorrectGuesses = 6;
    let currentHangmanWord = '';
    let guessedLetters = [];
    let incorrectGuesses = 0;

    const hangmanStages = [
        `
  +---+
  |   |
      |
      |
      |
      |
=========''`,
        `
  +---+
  |   |
  O   |
      |
      |
      |
=========''`,
        `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========''`,
        `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========''`,
        `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========''`,
        `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========''`,
        `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
========='`
    ];


    function initializeHangmanGame() {
        currentHangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
        guessedLetters = [];
        incorrectGuesses = 0;
        hangmanMessage.style.display = 'none';
        hangmanMessage.textContent = '';

        renderHangmanWord();
        renderHangmanLetters();
        updateHangmanFigure();
        updateHangmanStats();
    }

    function renderHangmanWord() {
        hangmanWordDisplay.innerHTML = currentHangmanWord
            .split('')
            .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
            .join('');
    }

    function renderHangmanLetters() {
        hangmanLettersContainer.innerHTML = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabet.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.disabled = guessedLetters.includes(letter);
            button.addEventListener('click', () => handleHangmanGuess(letter));
            hangmanLettersContainer.appendChild(button);
        });
    }

    function handleHangmanGuess(letter) {
        if (guessedLetters.includes(letter) || incorrectGuesses >= maxIncorrectGuesses) return;

        guessedLetters.push(letter);
        document.querySelector(`.hangman-letters button:nth-child(${letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1})`).disabled = true;


        if (currentHangmanWord.includes(letter)) {
            renderHangmanWord();
            checkHangmanWin();
        } else {
            incorrectGuesses++;
            updateHangmanFigure();
            updateHangmanStats();
            checkHangmanLose();
        }
    }
    
    function updateHangmanFigure() {
        hangmanFigure.textContent = hangmanStages[incorrectGuesses];
    }

    function updateHangmanStats() {
        hangmanIncorrectGuessesDisplay.textContent = incorrectGuesses;
        hangmanMaxGuessesDisplay.textContent = maxIncorrectGuesses;
    }

    function checkHangmanWin() {
        if (currentHangmanWord.split('').every(letter => guessedLetters.includes(letter))) {
            hangmanMessage.textContent = "You Win! Congratulations!";
            hangmanMessage.style.color = "green";
            hangmanMessage.style.display = 'block';
            disableHangmanLetterButtons();
        }
    }

    function checkHangmanLose() {
        if (incorrectGuesses >= maxIncorrectGuesses) {
            hangmanMessage.textContent = `Game Over! The word was: ${currentHangmanWord}`;
            hangmanMessage.style.color = "red";
            hangmanMessage.style.display = 'block';
            hangmanWordDisplay.innerHTML = currentHangmanWord; // Reveal word
            disableHangmanLetterButtons();
        }
    }

    function disableHangmanLetterButtons() {
        const buttons = hangmanLettersContainer.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
    }

    if (startHangmanGameBtn) {
        startHangmanGameBtn.addEventListener('click', initializeHangmanGame);
        // Initialize on load as well
        initializeHangmanGame();
    }

    // --- Trivia Game ---
    const triviaQuestionContainer = document.getElementById('trivia-question-container');
    const triviaQuestionText = document.getElementById('trivia-question-text');
    const triviaOptionsContainer = document.getElementById('trivia-options-container');
    const startTriviaGameBtn = document.getElementById('start-trivia-game');
    const nextTriviaQuestionBtn = document.getElementById('next-trivia-question');
    const triviaScoreDisplay = document.getElementById('trivia-score');
    const triviaWinGoalDisplay = document.getElementById('trivia-win-goal');
    const triviaFeedbackMessage = document.getElementById('trivia-feedback-message');
    const triviaResultsMessage = document.getElementById('trivia-results-message');
    // NUEVO: Elemento para mostrar errores incorrectos
    const triviaIncorrectGuessesDisplay = document.getElementById('trivia-incorrect-guesses');


    // Define your trivia questions here in English
    const triviaQuestions = [
        {
            question: "What is the capital city of Canada?",
            options: ["Vancouver", "Toronto", "Ottawa", "Montreal"],
            answer: "Ottawa"
        },
        {
            question: "What is the national animal of Canada?",
            options: ["Polar Bear", "Moose", "Beaver", "Canadian Goose"],
            answer: "Beaver"
        },
        {
            question: "What are the two official languages of Canada?",
            options: ["English and Spanish", "French and German", "English and French", "Only English"],
            answer: "English and French"
        },
        {
            question: "Which famous natural site in Canada shares a border with the USA?",
            options: ["The Rocky Mountains", "Niagara Falls", "Lake Louise", "Banff National Park"],
            answer: "Niagara Falls"
        },
        {
            question: "What is the leaf symbol on the Canadian flag?",
            options: ["Oak Leaf", "Maple Leaf", "Pine Leaf", "Ash Leaf"],
            answer: "Maple Leaf"
        },
        {
            question: "Which sport is Canada's national winter sport?",
            options: ["Basketball", "Curling", "Skiing", "Ice Hockey"],
            answer: "Ice Hockey"
        },
        {
            question: "What is the largest city in Canada by population?",
            options: ["Vancouver", "Montreal", "Toronto", "Calgary"],
            answer: "Toronto"
        },
        {
            question: "Which Canadian province is the only one with French as its sole official language?",
            options: ["Ontario", "British Columbia", "Quebec", "Alberta"],
            answer: "Quebec"
        },
        {
            question: "What famous winter festival is held annually in Quebec City?",
            options: ["Winterlude", "Montreal International Jazz Festival", "Quebec Winter Carnival", "Celebralight"],
            answer: "Quebec Winter Carnival"
        },
        {
            question: "Which mountain range stretches along the border between Alberta and British Columbia?",
            options: ["Appalachian Mountains", "Coast Mountains", "Rocky Mountains", "Laurentian Mountains"],
            answer: "Rocky Mountains"
        }
    ];

    let currentTriviaQuestionIndex = 0;
    let triviaScore = 0;
    let triviaIncorrectGuesses = 0; // NUEVO: Contador de errores incorrectos
    const TRIVIA_WIN_GOAL = 5; // Goal for correct answers to win
    const TRIVIA_MAX_INCORRECT_GUESSES = 1; // NUEVO: Máximo de errores permitidos

    function initializeTriviaGame() {
        currentTriviaQuestionIndex = 0;
        triviaScore = 0;
        triviaIncorrectGuesses = 0; // Reiniciar contador de errores
        triviaQuestionContainer.style.display = 'none';
        triviaFeedbackMessage.style.display = 'none';
        triviaResultsMessage.style.display = 'none';
        nextTriviaQuestionBtn.style.display = 'none';
        updateTriviaStats();
        // Shuffle the questions at the start of each game
        triviaQuestions.sort(() => Math.random() - 0.5);
        startTriviaQuestion();
    }

    function startTriviaQuestion() {
        // Primero, verificar si el jugador ya ganó
        if (triviaScore >= TRIVIA_WIN_GOAL) {
            displayTriviaResults(true); // Player won
            return;
        }
        // Luego, verificar si el jugador ha agotado sus errores
        if (triviaIncorrectGuesses >= TRIVIA_MAX_INCORRECT_GUESSES) {
            displayTriviaResults(false); // Player lost due to too many incorrect guesses
            return;
        }
        // Finalmente, verificar si no quedan más preguntas
        if (currentTriviaQuestionIndex >= triviaQuestions.length) {
            displayTriviaResults(false); // Ran out of questions, didn't win
            return;
        }

        triviaQuestionContainer.style.display = 'block';
        triviaFeedbackMessage.style.display = 'none';
        nextTriviaQuestionBtn.style.display = 'none';

        const questionData = triviaQuestions[currentTriviaQuestionIndex];
        triviaQuestionText.textContent = questionData.question;
        triviaOptionsContainer.innerHTML = ''; // Clear previous options

        // Shuffle the options so they don't always appear in the same order
        const shuffledOptions = [...questionData.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option;
            button.addEventListener('click', () => handleTriviaOptionClick(option, questionData.answer));
            triviaOptionsContainer.appendChild(button);
        });

        updateTriviaStats();
    }

    function handleTriviaOptionClick(selectedOption, correctAnswer) {
        const optionButtons = triviaOptionsContainer.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.disabled = true; // Disable all buttons after a selection
            if (button.textContent === correctAnswer) {
                button.classList.add('correct'); // Highlight the correct answer
            } else if (button.textContent === selectedOption) {
                button.classList.add('incorrect'); // Highlight the incorrect selected answer
            }
        });

        if (selectedOption === correctAnswer) {
            triviaScore++;
            triviaFeedbackMessage.textContent = "Correct!";
            triviaFeedbackMessage.style.color = "green";
        } else {
            triviaIncorrectGuesses++; // NUEVO: Incrementar errores
            triviaFeedbackMessage.textContent = `Incorrect. The correct answer was: ${correctAnswer}`;
            triviaFeedbackMessage.style.color = "red";
        }
        triviaFeedbackMessage.style.display = 'block';
        nextTriviaQuestionBtn.style.display = 'block';
        updateTriviaStats();

        // Check if game ends after this guess (win or lose)
        if (triviaScore >= TRIVIA_WIN_GOAL || triviaIncorrectGuesses >= TRIVIA_MAX_INCORRECT_GUESSES || currentTriviaQuestionIndex + 1 >= triviaQuestions.length) {
             nextTriviaQuestionBtn.textContent = "Show Results";
        } else {
            nextTriviaQuestionBtn.textContent = "Next Question";
        }
    }

    function updateTriviaStats() {
        triviaScoreDisplay.textContent = triviaScore;
        triviaWinGoalDisplay.textContent = TRIVIA_WIN_GOAL; // Update win goal display
        // NUEVO: Actualizar display de errores
        if (triviaIncorrectGuessesDisplay) { // Asegurarse de que el elemento exista
            triviaIncorrectGuessesDisplay.textContent = triviaIncorrectGuesses;
        }
    }

    function displayTriviaResults(hasWon) {
        triviaQuestionContainer.style.display = 'none';
        triviaFeedbackMessage.style.display = 'none';
        nextTriviaQuestionBtn.style.display = 'none';
        triviaResultsMessage.style.display = 'block';

        if (hasWon) {
            triviaResultsMessage.textContent = `Congratulations! You won the Canadian Trivia Challenge with ${triviaScore} correct answers!`;
            triviaResultsMessage.style.color = "green";
        } else {
            // Mensaje de derrota más específico
            if (triviaIncorrectGuesses >= TRIVIA_MAX_INCORRECT_GUESSES) {
                triviaResultsMessage.textContent = `Game Over! You made too many incorrect guesses (${triviaIncorrectGuesses} out of ${TRIVIA_MAX_INCORRECT_GUESSES}). You got ${triviaScore} correct answers. Try again!`;
            } else {
                triviaResultsMessage.textContent = `Game Over! You answered ${triviaScore} out of ${TRIVIA_WIN_GOAL} questions correctly to win. Try again!`;
            }
            triviaResultsMessage.style.color = "red";
        }
    }

    // Event Listeners for Trivia Game
    if (startTriviaGameBtn) {
        startTriviaGameBtn.addEventListener('click', initializeTriviaGame);
    }
    if (nextTriviaQuestionBtn) {
        nextTriviaQuestionBtn.addEventListener('click', () => {
            currentTriviaQuestionIndex++;
            // Verificar las condiciones de finalización antes de iniciar la siguiente pregunta
            if (triviaScore >= TRIVIA_WIN_GOAL || triviaIncorrectGuesses >= TRIVIA_MAX_INCORRECT_GUESSES || currentTriviaQuestionIndex >= triviaQuestions.length) {
                displayTriviaResults(triviaScore >= TRIVIA_WIN_GOAL);
            } else {
                startTriviaQuestion();
            }
        });
    }


});
