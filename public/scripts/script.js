var ansKey = {}
var submittedAns = {}
var maxTimeInMinutes = 0;
var totalQuestions = 0;
var data;
var score;
var emailId;
var title;
var subtitle;
var unattemptedQns;
var wrongAnswers;
var correctAns;
var timeTaken;
var testId;
var name;
// var qnAnswer
document.querySelector('#submitTestModalId').style.display = 'none';

async function getQuestionBank(testId) {
    let response = await fetch('./data/question_bank/' + testId + '.json');
    let data = await response.json();
    return data;
}
async function displayQuestions(testId) {
    res = await getQuestionBank(testId)
    // console.log(res)
    maxTimeInMinutes = parseInt(res['timerInMinutes'])
    qnAnswers = res['questions_and_answerkey'];
    totalQuestions = qnAnswers.length;
    title = res['title'];
    data = res;
    createStartTestModal();
    formElement = document.getElementById('qn_ans_form');
    fragment = document.createDocumentFragment();
    bindEvents();
}

function showQuestions() {
    for (const qnAnswer of qnAnswers) {
        ansKey[qnAnswer['qn_num']] = qnAnswer['answer'];
        // create ansKey object which will be used to validate the answers..
        // const cardDivFragment = document.createDocumentFragment();
        const cardDiv = document.createElement('div');
        cardDiv.dataset.clicked = false;
        cardDiv.classList.add('card');
        const qnTitleTag = document.createElement('h2');
        qnTitleTag.classList.add('qnTitle', 'noselect');
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
    // const inputSubmitContainerFrag = document.createDocumentFragment();

    const inputSubmitElem = document.createElement('input')
    inputSubmitElem.classList.add('btn')
    inputSubmitElem.setAttribute('type', 'submit');
    inputSubmitElem.setAttribute('value', 'Submit');
    inputSubmitElem.setAttribute('id', 'submitTestBtn')

    inputSubmitContainer.appendChild(inputSubmitElem);


    // inputSubmitContainer.appendChild(inputSubmitContainerFrag);
    fragment.appendChild(inputSubmitContainer)

    formElement.appendChild(fragment);

    formElement.addEventListener('click', (e) => {
        if (e.target.value != 'Submit') {
            submittedAns[e.target.name] = e.target.value;

        }
    })
}
function validateEmail(emailId) {
    const regex = /.+@gmail.com$/;
    // console.log(regex.lastIndex);
    // console.log(regex.test(emailId));
    return regex.test(emailId);
}
function validateName(name) {
    var regex = /^[a-zA-Z]+(\s*[a-zA-Z]*)+$/;
    // adhoc changes
    return regex.test(name);
}
function bindEvents() {

    document.querySelector('#qn_ans_form').addEventListener('click', (e) => {
        const tagClicked = e.target.tagName;
        if (tagClicked == 'INPUT') {
            e.target.parentElement.parentElement.dataset.clicked = true;
        }


    })

    document.querySelector('#startTestBtn').addEventListener('click', () => {
        emailId = document.querySelector('#email').value;
        name = document.querySelector('#name').value;
        if (!validateEmail(emailId)) {
            // console.log(emailId);
            document.querySelector('#nameErrorMsg').innerText = "";
            document.querySelector('#emailErrorMsg').innerText = "Please Enter Valid Email Id";
            return;
        }
        if (!validateName(name)) {
            document.querySelector('#emailErrorMsg').innerText = "";
            document.querySelector('#nameErrorMsg').innerText = "Please Enter Valid Name";
            return;
        }
        document.querySelector('#startTestModalId').style.display = 'none';
        showQuestions();
        createTimer(maxTimeInMinutes, formElement);

        formElement.onsubmit = handleFormSubmit;


    });
    document.querySelector('#submitTestModalClose').addEventListener('click', () => {
        document.querySelector('#submitTestModalId').style.display = 'none';
        // document.querySelector('#qn_ans_form').style.display = 'block';
    })
}

function createStartTestModal() {
    // document.querySelector('#startTestModalTitle').innerText = `${res['title']} `
    document.querySelector('#startTestModalTitle').innerText = title;

    document.querySelector('#submitTestModalTitle').innerText = `${res['title']} `
    document.querySelector('#startTestModalId').style.display = 'block';
    document.querySelector('#numOfQnsStartTestModal').innerText = totalQuestions;
    document.querySelector('#duration').innerText = maxTimeInMinutes;
}

function handleFormSubmit(e) {

    e.preventDefault();
    document.querySelector('#submitTestBtn').setAttribute('disabled', true);
    // result = calculateScore();
    ({ score, wrongAnswers, unattemptedQns, correctAns } = calculateScore());
    // console.log(`score ${score}`)
    // console.log(`wrong ans ${wrongAnswers}`)
    // console.log(`unattemptedQns ${unattemptedQns}`)
    // console.log(`correct ans ${correctAns}`)
    // time taken is stored in seconds
    storeScore(emailId, score, timeTaken, testId, name);
    document.getElementById('score').innerHTML = `Score <span class="score">${score}/${totalQuestions}</span>`;
    // document.querySelector('#qn_ans_form').style.display = 'none';
    createSubmitTestModal();


}
async function postData(url = '/storeScore', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function storeScore(emailId, score, timeTaken, testId, name) {
    postData('/storeScore', { emailId: emailId, score: score, timeTaken: timeTaken, testId: testId, name: name })
        .then(data => {
            // console.log(data); // JSON data parsed by `data.json()` call
        });
}
function createSubmitTestModal() {
    // console.log(emailId)
    // const rank = calculateRank(emailId);
    document.querySelector('#submitTestModalId').style.display = 'block';
    document.querySelector('#numOfQnsSubmitTestModal').innerText = totalQuestions;
    document.querySelector('#correctAns').innerText = score;
    document.querySelector('#wrongAns').innerText = wrongAnswers;
    document.querySelector('#unattemptedQns').innerText = unattemptedQns;
}
// get the users for a particular testId
async function getUsers(testId) {
    const users = await fetch('/getUsers');
}
function calculateRank(emailId) {
    // get list of users with their score and timetaken 
    // sort by score and if tie then sort by timetaken


    usersList = getUsers(testId)
}
// store the ansewers clicked during the test
function calculateScore() {
    // console.log(e)

    // console.log(`total qns: ${totalQuestions}`)
    clearInterval(timerId)

    // to get the answers selected
    result = {}
    score = 0;
    // calculate unattempted qns
    unattemptedQns = document.querySelectorAll('[data-clicked="false"]').length;
    // console.log(`unattempted qns: ${unattemptedQns}`)
    // console.log(unattemptedQns)
    let allInputElements = document.getElementsByTagName('input');
    Object.keys(ansKey).forEach(qn => {
        if (submittedAns[qn] == ansKey[qn]) {
            // adding green color to right answer
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
            // adding green and red color
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
    correctAns = score;
    result['score'] = score;
    result['correctAns'] = correctAns;
    result['wrongAnswers'] = totalQuestions - score - unattemptedQns;
    result['unattemptedQns'] = unattemptedQns;
    return result;

}

function createTimer(maxTimeInMinutes, formElement) {
    timeTaken = 0;
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
        timeTaken += 1;
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
urlParams = new URLSearchParams(window.location.search);
testId = urlParams.get('testId');
displayQuestions(testId);
