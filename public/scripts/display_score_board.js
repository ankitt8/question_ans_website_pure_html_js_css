var testId;
async function getUsersByTestId() {
    const users = await fetch('/getUsersByTestId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({testId: `${testId}`})
    });
    return users.json();
}
function sortUsersByScoreTime(users) {
    users.sort((a, b) => {
        const aScore = parseInt(a['score']);
        const bScore = parseInt(b['score']);
        const aTime = parseInt(a['timeTaken']);
        const bTime = parseInt(b['timeTaken']);
        if (aScore == bScore) {
            return bTime - aTime;
        } else {
            return bScore - aScore
        }
    });
    return users;
}
// users is array of object sorted by score and time taken to solve test
function createScoreBoard(users) {
   
    let scoreBoard = document.querySelector('.score-board');
  
    // header row displaying name and score
    const div = document.createElement('div');
    div.classList.add('score-board__score','score-board__header');
    // name inside header row
    const nameH1 = document.createElement('h1');
    nameH1.innerText = "Name";
    div.appendChild(nameH1);
    // score inside header row
    const scoreH1 = document.createElement('h1');
    scoreH1.innerText = "Score";
    div.appendChild(scoreH1);

    scoreBoard.appendChild(div);
    // feedback in no users have give then test
    if(users.length == 0) {
        const div = document.createElement('div');
        div.classList.add('score-board__nousers');
        const p = document.createElement('p');
        p.innerText = 'No users have yet given the test';
        div.appendChild(p);
        scoreBoard.appendChild(div);
        return;
    }
    let fragment = document.createDocumentFragment();
    for(const user of users) {
        let div = document.createElement('div');
        div.classList.add('score-board__score');
        // append name of user
        let name = document.createElement('h3');
        name.innerText = user['name']
        div.appendChild(name);
        // append score of user
        let score = document.createElement('h3')
        score.innerText = user['score'];
        div.appendChild(score);
        // append div to scoreBoard
        fragment.appendChild(div);
        const hrEle = document.createElement('hr');
        hrEle.classList.add('score-board__hr')
        fragment.appendChild(hrEle);
    }
    scoreBoard.appendChild(fragment)
}
async function displayScoreBoard() {
    const users = await getUsersByTestId();
    const sortedUsers = sortUsersByScoreTime(users);
    createScoreBoard(sortedUsers);
}
urlParams = new URLSearchParams(window.location.search);
testId = urlParams.get('testId');
displayScoreBoard();