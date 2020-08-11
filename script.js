
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
    console.log(e.target)
    submittedAns[e.target.name] = e.target.value;
}
document.getElementById('qn_ans_form').onsubmit = (e) => {
    e.preventDefault();
    // to get the answers selected
    let score = 0;
    Object.keys(ansKey).forEach(key => {
        if (submittedAns[key] == ansKey[key]) {
            score += 1;
        }
    })
    document.getElementById('score').innerHTML = `Your Score is: ${score}`;
    console.log(score)
}
