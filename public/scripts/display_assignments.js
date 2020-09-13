
async function getAssignments() {
    const assignments = await fetch('/getAssignments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return assignments.json();
}

// users is array of object sorted by score and time taken to solve test
function createAssignmentBoard(assignments) {

    let assignmentBoard = document.querySelector('.score-board');

    // header row displaying name and score
    const div = document.createElement('div');
    div.classList.add('score-board__score', 'score-board__header');
    // name inside header row
    const nameH1 = document.createElement('h1');
    nameH1.innerText = "Assignments";
    div.appendChild(nameH1);
    // score inside header row

    assignmentBoard.appendChild(div);
    // feedback in no users have give then test
    if (assignments.length == 0) {
        const div = document.createElement('div');
        div.classList.add('score-board__nousers');
        const p = document.createElement('p');
        p.innerText = 'No users have yet submitted the assignments';
        div.appendChild(p);
        assignmentBoard.appendChild(div);
        return;
    }
    let fragment = document.createDocumentFragment();
    for (const assignment of assignments) {
        let div = document.createElement('div');
        div.classList.add('score-board__score');
        // append name of user
        let file_path = document.createElement('a');
        file_path.innerText = assignment['name'];
        file_path.setAttribute('href', assignment['file_path']);
        div.appendChild(file_path);

        fragment.appendChild(div);
    }
    assignmentBoard.appendChild(fragment)
}
async function displayAssignmentBoard() {
    const assignments = await getAssignments();
    // console.log(assignments)
    createAssignmentBoard(assignments);
}
displayAssignmentBoard();