// figure out why name is not here but still i am able to access name defined in scritp .js
// console.log(Object.keys('window'));

// figure out why emailId is not accessible
// console.log(emailId);
// console.log(name);


function validate() {
    var name = document.querySelector('#_name').value;
    const regex = /^[a-zA-Z]+\s*[a-zA-Z]$/;
    document.querySelector('#file_input').setAttribute('name', name);
    return regex.test(name);
}
if (!name) {

    // console.log(document);
    var nameInputDiv = document.querySelector('#input_div');
    // console.log(nameInputDiv)
    var inputName = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('id', '_name');
    inputName.setAttribute('placeholder', 'Enter Your Name');
    inputName.setAttribute('value', '');

    nameInputDiv.appendChild(inputName);

}


// document.querySelector('#assignment_form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     console.log(e.target.value)
//     // console.log(e);
//     fetch('/store-assignment', { // Your POST endpoint
//         method: 'POST',
//         headers: {
//             // Content-Type may need to be completely **omitted**
//             // or you may need something
//             "Content-Type": "multipart/form-data"
//         },
//         body: e.target.value // This is your file object
//     }).then(
//         response => response.json() // if the response is a JSON object
//     ).then(
//         success => console.log(success) // Handle the success response object
//     ).catch(
//         error => console.log(error) // Handle the error response object
//     );
// })