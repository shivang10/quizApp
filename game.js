const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//console.log(choices);

const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const positiveScore = document.getElementById("positiveScore");
const negativeScore = document.getElementById("negativeScore");

let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then( res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map( loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
            answerChoices.forEach( (choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            })
            return formattedQuestion;
        });
       // questions = loadedQuestions;
        startGame();
    }).catch( err => {
        console.log(err);
    });

//const correct_bonus = 10;
let posScore;
let negScore;
const max_question = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= max_question){
        
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");
    }
    posScore = Math.floor(Math.random() * 100) + 1;
    negScore = -Math.floor(Math.random() * 25) + 1;
    positiveScore.innerText = "Score for correct answer: " + posScore;
    negativeScore.innerText = "Score for wrong answer: " + negScore;
    questionCounter++;
    progressText.innerText = "Question " + questionCounter + "/" + max_question;

    progressBarFull.style.width = `${(questionCounter/max_question)*100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswer = true;
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswer) return;
        acceptingAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        
        if(classToApply === 'correct'){
            updateScore(posScore);
        }
        else{
            updateScore(negScore);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000)
        
    });
});

updateScore = num => {
    score+=num;
    scoreText.innerText = score;
}
