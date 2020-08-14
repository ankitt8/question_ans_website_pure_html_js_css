var ansKey = {}
var submittedAns = {}
var maxTimeInMinutes = 0;
var totalQuestions = 0;
var data;
var score;
// async function getQuestionBank(testId = 'physics_12-08-2020.json') {
//     let response  = await fetch('./data/question_bank/' + testId);
//     let data = await response.json();
//     return data;
// }
// const promise = getQuestionBank(testId = 'physics_12-08-2020.json')
// promise.then(result => {
//     data = result;
// })
// // const data  = .then((data) => data);
// console.log(data)
function displayQuestions(testId = 'physics_12-08-2020.json') {
    fetch('./data/question_bank/' + testId)
        .then(res => res.json())
        .then(res => {
            maxTimeInMinutes = parseInt(res['timerInMinutes'])
            const qnAnswers = res['questions_and_answerkey'];
            totalQuestions = qnAnswers.length;
            document.getElementsByClassName('highlight')[0].innerText = `${res['title']} `;
            const formElement = document.getElementById('qn_ans_form');
            const fragment = document.createDocumentFragment();
            for (const qnAnswer of qnAnswers) {
                ansKey[qnAnswer['qn_num']] = qnAnswer['answer'];
                // create ansKey object which will be used to validate the answers..
                // const cardDivFragment = document.createDocumentFragment();
                const cardDiv = document.createElement('div');
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
            inputSubmitElem.addEventListener('click', createSubmitTestModal);
            inputSubmitContainerFrag.appendChild(inputSubmitElem);


            inputSubmitContainer.appendChild(inputSubmitContainerFrag);
            fragment.appendChild(inputSubmitContainer)

            formElement.appendChild(fragment);
            createTimer(maxTimeInMinutes, formElement);
        });
}

function createStartTestModal() {
    document.querySelector('#startTestModalId').style.display = 'block';
    // document.querySelector('#numOfQns').innerText = Object.keys(ansKey).length;
    // document.querySelector('#duration').innerText = maxTimeInMinutes;
    document.querySelector('#startTestBtn').addEventListener('click', () => {
        document.querySelector('#startTestModalId').style.display = 'none';
        // document.querySelector('.timer').style.display = 'inline-block';
        displayQuestions(testId = 'physics_12-08-2020.json');
    })

}
function createSubmitTestModal() {
    console.log('inside createSubmitTestModal')
    document.querySelector('#submitTestModalId').style.display = 'block';
    // document.querySelector('#correctAns').innerText = score;
    document.querySelector('#submitTestModalClose').addEventListener('click', () => {
        document.querySelector('#submitTestModalId').style.display = 'none';
       
    })
    // disable all input 
    // document.querySelectorAll('input').forEach(ele => {ele.disabled = true;})
    // document.querySelector('#wrongAns').innerText = 
}
window.onload = function () {

    document.querySelector('#submitTestModalId').style.display = 'none';
    createStartTestModal();

}

// store the ansewers clicked during the test
document.getElementById('qn_ans_form').onclick = (e) => {
    submittedAns[e.target.name] = e.target.value;
}
function calculateScore(e) {
    // console.log(e)
    clearInterval(timerId)
    e.preventDefault();
    // to get the answers selected

    score = 0;
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
    document.getElementById('score').innerHTML = `Score <span class="score">${score}/${totalQuestions}</span>`;
}
document.getElementById('qn_ans_form').onsubmit = calculateScore;

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



