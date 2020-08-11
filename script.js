
var ansKey = {
    q1: 'c',
    q2: 'b',
    q3: 'd',
    q4: 'c',
    q5: 'a',
    q6: 'c',
    q7: 'b'
}
var submittedAns = {}
document.getElementById('qn_ans_form').onclick = (e) => {
    // console.log(e.target)
    submittedAns[e.target.name] = e.target.value;
}
document.getElementById('qn_ans_form').onsubmit = (e) => {
    e.preventDefault();
    // to get the answers selected
    let score = 0;
    let allInputElements = document.getElementsByTagName('input');
    Object.keys(ansKey).forEach(qn => {
        if (submittedAns[qn] == ansKey[qn]) {
            for (let i = 0; i < allInputElements.length; ++i) {
                const inputEle = allInputElements[i];
                if (inputEle.name == qn) {
                    if (inputEle.value == submittedAns[qn]) {
                        console.log(inputEle)
                        console.log(inputEle.parentElement)
                        inputEle.parentElement.classList.add('green')
                    }
                }
            }

            score += 1;
        } else {
            for (let i = 0; i < allInputElements.length; ++i) {
                const inputEle = allInputElements[i];
                if (inputEle.name == key) {
                    if (inputEle.value == submittedAns[key]) {
                        console.log(inputEle)
                        console.log(inputEle.parentElement)
                        inputEle.parentElement.classList.add('red')
                    }
                }
            }
        }
    })
    document.getElementById('score').innerHTML = `Your Score is: ${score}/7`;
    console.log(score)
}
