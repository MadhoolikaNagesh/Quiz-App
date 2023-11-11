// Get references to HTML elements
const questionElement = document.getElementById("quest");
const result = document.getElementById("ans-op");
const nextButton = document.getElementById("next-option");

// Initialize global variables
let currentQuestIdx = 0;
let score = 0;

// Function to start the quiz
function startQuiz() {
    // Reset quiz state
    currentQuestIdx = 0;
    score = 0;

    // Set the "Next" button text
    nextButton.innerHTML = "Next";

    // Fetch questions to start the quiz
    fetchQuestions();
}

// Function to fetch questions from the API
function fetchQuestions() {
    // API URL for fetching trivia questions
    const apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';

    // Fetch questions from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Check if questions are available in the API response
            if (data.results && data.results.length > 0) {
                // Format and store the fetched questions
                questions = formatQuestions(data.results);
                
                // Display the first question
                showQuest();
            } else {
                console.error('No questions found in the API response.');
            }
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

// Function to format raw API questions into a structured format
function formatQuestions(apiQuestions) {
    return apiQuestions.map(apiQuestion => {
        return {
            quest: apiQuestion.question,
            ans: [
                { text: apiQuestion.correct_answer, answer: true },
                ...apiQuestion.incorrect_answers.map(incorrectAnswer => ({ text: incorrectAnswer, answer: false }))
            ]
        };
    });
}

// Function to display the current question and its answer options
function showQuest() {
    // Clear the result element
    result.innerHTML = "";

    // Get the current question
    let currentquest = questions[currentQuestIdx];
    let questno = currentQuestIdx + 1;

    // Display the current question number and text
    questionElement.innerHTML = questno + "." + currentquest.quest;

    // Create buttons for each answer and add event listeners
    currentquest.ans.forEach(ans => {
        const button = document.createElement("button");
        button.innerHTML = ans.text;
        button.classList.add("btn");
        result.appendChild(button);

        // Add click event listener to check the selected answer
        button.addEventListener("click", function () {
            checkAnswer(ans.answer, button);
        });
    });
}

// Function to check if the selected answer is correct
function checkAnswer(isCorrect, button) {
    // Update score and button styling based on the correctness of the answer
    if (isCorrect) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }

    // Disable all buttons to prevent further interaction
    disableButtons();

    // Move to the next question after a short delay
    currentQuestIdx++;

    // Display the next question or end the game
    if (currentQuestIdx < questions.length) {
        setTimeout(() => showQuest(), 1000);
    } else {
        endGame();
    }
}

// Function to disable all answer buttons
function disableButtons() {
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Function to display the end of the quiz and the user's final score
function endGame() {
    questionElement.innerHTML = "Quiz Completed!";
    result.innerHTML = "Your Score: " + score + " out of " + questions.length;
}

// Start the quiz when the script is loaded
startQuiz();
