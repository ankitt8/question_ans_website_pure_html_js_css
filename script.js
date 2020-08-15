var ansKey = {}
var submittedAns = {}
var maxTimeInMinutes = 0;
var totalQuestions = 0;
var data;
var score;
// var qnAnswer
async function getQuestionBank(testId = 'physics_12-08-2020.json') {
    let response = await fetch('./data/question_bank/' + testId);
    let data = await response.json();
    return data;
}
document.querySelector('#submitTestModalId').style.display = 'none';

function showQuestions() {
    for (const qnAnswer of qnAnswers) {
        ansKey[qnAnswer['qn_num']] = qnAnswer['answer'];
        // create ansKey object which will be used to validate the answers..
        // const cardDivFragment = document.createDocumentFragment();
        const cardDiv = document.createElement('div');
        cardDiv.dataset.clicked = false;
        cardDiv.classList.add('card');
        const qnTitleTag = document.createElement('h2');
        qnTitleTag.classList.add('qnTitle');
        qnTitleTag.innerHTML = `<strong>Q${qnAnswer['qn_num']})</strong> ${qnAnswer['qn_title']}`;
        // cardDivFragment.appendChild(cardDiv);
        cardDiv.appendChild(qnTitleTag);

        const labelsFragment = document.createDocumentFragment();
        for (const option of Object.keys(qnAnswer['options'])) {

            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name=${qnAnswer['qn_num']} value=${option}> ${qnAnswer['options'][option]}`
            labelsFragment.appendChild(label);

        }
        cardDiv.appendChild(labelsFragment);
        fragment.appendChild(cardDiv);
    }
    const inputSubmitContainer = document.createElement('div');
    inputSubmitContainer.classList.add('submit-container')
    const inputSubmitContainerFrag = document.createDocumentFragment();

    const inputSubmitElem = document.createElement('input')
    inputSubmitElem.classList.add('btn')
    inputSubmitElem.setAttribute('type', 'submit');
    inputSubmitElem.setAttribute('value', 'Submit');

    inputSubmitContainerFrag.appendChild(inputSubmitElem);


    inputSubmitContainer.appendChild(inputSubmitContainerFrag);
    fragment.appendChild(inputSubmitContainer)

    formElement.appendChild(fragment);

    formElement.addEventListener('click', (e) => {
        if (e.target.value != 'Submit') {
            submittedAns[e.target.name] = e.target.value;

        }
    })
}
function validateEmail(userEmail) {
    return true;
}
function bindEvents() {
   
    document.querySelector('#qn_ans_form').addEventListener('click', (e) => {
        console.log(e.target.parentElement.dataset)
        e.target.parentElement.dataset.clicked = true;
    })
    const clickedEles = document.querySelectorAll(`[data-clicked]`);
    console.log(clickedEles)
    document.querySelector('#startTestBtn').addEventListener('click', () => {

        // if the user has entered the correct email only then the test should start
        // const userEmail = document.querySelector('#emailInputBox').value;
        // // console.log(userEmail);
        // if (validateEmail(userEmail)) {
        //     document.querySelector('#startTestModalId').style.display = 'none';
        //     // document.querySelector('.timer').style.display = 'inline-block';
        //     showQuestions();
        //     createTimer(maxTimeInMinutes, formElement);
        //     formElement.onsubmit = handleFormSubmit;
        // } else {
        //     document.querySelector('#emailError').innerText = '!!!Please Enter Valid Email!!!'
        // }
        document.querySelector('#startTestModalId').style.display = 'none';
        // document.querySelector('.timer').style.display = 'inline-block';
        showQuestions();
        createTimer(maxTimeInMinutes, formElement);
        formElement.onsubmit = handleFormSubmit;
        

    });
    document.querySelector('#submitTestModalClose').addEventListener('click', () => {
        document.querySelector('#submitTestModalId').style.display = 'none';
    })
}
async function displayQuestions(testId = 'physics_12-08-2020.json') {
    res = await getQuestionBank(testId = 'physics_12-08-2020.json')
    // console.log(res)
    maxTimeInMinutes = parseInt(res['timerInMinutes'])
    qnAnswers = res['questions_and_answerkey'];
    totalQuestions = qnAnswers.length;
    data = res;
   
   
   
    createStartTestModal();
    

    formElement = document.getElementById('qn_ans_form');
    fragment = document.createDocumentFragment();
    bindEvents();

    
    
}

function createStartTestModal() {
    document.querySelector('#startTestModalTitle').innerText = `${res['title']} `
    document.querySelector('#submitTestModalTitle').innerText = `${res['title']} `
    document.querySelector('#startTestModalId').style.display = 'block';
    document.querySelector('#numOfQnsStartTestModal').innerText = totalQuestions;
    document.querySelector('#duration').innerText = maxTimeInMinutes;
}

function handleFormSubmit(e) {
   
    e.preventDefault();

    unattemptedQns = 0;
    score = calculateScore();
    // store the score
    // storeScore(userEmail, score);
    document.getElementById('score').innerHTML = `Score <span class="score">${score}/${totalQuestions}</span>`;
    createSubmitTestModal();
}
function storeScore(userEmail, score) {

}
function createSubmitTestModal() {
   
    document.querySelector('#submitTestModalId').style.display = 'block';
    document.querySelector('#numOfQnsSubmitTestModal').innerText = totalQuestions;
    document.querySelector('#correctAns').innerText = score;
    document.querySelector('#wrongAns').innerText = totalQuestions - unattemptedQns- score;
    document.querySelector('#unattemptedQns').innerText = unattemptedQns;
    

}


// store the ansewers clicked during the test
function calculateScore() {
    // console.log(e)
    
    clearInterval(timerId)
   
    // to get the answers selected

    score = 0;
    // calculate unattempted qns
    unattemptedQns=document.querySelectorAll('[data-clicked="false"]').length;
    console.log(unattemptedQns)
    let allInputElements = document.getElementsByTagName('input');
    Object.keys(ansKey).forEach(qn => {
        if (submittedAns[qn] == ansKey[qn]) {
            for (let i = 0; i < allInputElements.length; ++i) {
                const inputEle = allInputElements[i];
                
                if (inputEle.name == qn) {
                    if (inputEle.value == submittedAns[qn]) {
                        inputEle.parentElement.classList.add('green')
                    }
                }
            }

            score += 1;
        } else {
            for (let i = 0; i < allInputElements.length; ++i) {
                const inputEle = allInputElements[i];
                if (inputEle.name == qn) {
                    if (inputEle.value == submittedAns[qn]) {
                        inputEle.parentElement.classList.add('red')
                    } else {
                        if (inputEle.value == ansKey[qn]) {
                            inputEle.parentElement.classList.add('green')
                        }
                    }
                }
            }
        }
    })
    return score;

}

function createTimer(maxTimeInMinutes, formElement) {
    maxTimeInMinutes = parseInt(maxTimeInMinutes)
    var hoursRemaining, minutesRemaining, secondsRemaining;
    [hoursRemaining, minutesRemaining, secondsRemaining] = [0, maxTimeInMinutes % 60, 00]
    if (maxTimeInMinutes >= 60) hoursRemaining = Math.floor(maxTimeInMinutes / 60);

    var hoursRemainingDisplay = (hoursRemaining < 10) ? `0${hoursRemaining}` : `${hoursRemaining}`;
    var minutesRemainingDisplay = (minutesRemaining < 10) ? `0${minutesRemaining}` : `${minutesRemaining}`;
    var secondsRemainingDisplay = (secondsRemaining < 10) ? `0${secondsRemaining}` : `${secondsRemaining}`;


    var timeToDisplay = `${hoursRemainingDisplay} : ${minutesRemainingDisplay} : ${secondsRemainingDisplay}`;

    var counterPEle = document.getElementById('counter');
    counterPEle.innerHTML = timeToDisplay;
    timerId = setInterval(() => {
        secondsRemaining -= 1;
        // console.log(minutesRemaining)
        if (secondsRemaining < 0) {
            secondsRemaining = 59;
            minutesRemaining -= 1;
            if (minutesRemaining < 0 && hoursRemaining > 0) {
                hoursRemaining -= 1;
                minutesRemaining = 59;
            } else if (minutesRemaining < 0 && hoursRemaining <= 0) {
                // timer has ended
                // console.log('Timer Ended');
                clearInterval(timerId);
                // console.log(formElement)
                formElement.requestSubmit();

                return;
            }
        }
        secondsRemainingDisplay = (secondsRemaining < 10) ? `0${secondsRemaining}` : `${secondsRemaining}`;
        minutesRemainingDisplay = (minutesRemaining < 10) ? `0${minutesRemaining}` : `${minutesRemaining}`;
        hoursRemainingDisplay = (hoursRemaining < 10) ? `0${hoursRemaining}` : `${hoursRemaining}`;
        counterPEle.innerHTML = `${hoursRemainingDisplay} : ${minutesRemainingDisplay} : ${secondsRemainingDisplay}`;


    }, 1000)
    // setTimeout(() => {clearInterval(timerId)}, maxTimeInMinutes*60*1000);
}

displayQuestions(testId = 'physics_12-08-2020.json');


