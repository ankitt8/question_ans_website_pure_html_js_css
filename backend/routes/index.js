const express = require('express')
const router = express.Router();
const path = require('path');
const multer = require('multer');
// const upload = multer({dest:'assignments/'})

const User = require('../models/User');
const Assignment = require('../models/Assignment');
var name;
function storeFile(file) {
    const assignment = new Assignment(file);
    assignment.save()
        .then((assignment) => {
            // res.status(200).json({ 'Status': `submission of assignment ${file_path} stored successfully!` })
            return `submission of assignment ${file} stored successfully!`
        })
        .catch((err) => {
            console.log(err);
            // res.status(400).send('Something went wrong')
            return 'Something Went wrong'
        })
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/assignments/')
    },
    filename: function (req, file, cb) {
        file_name = file.originalname + '-' + Date.now() + ".html";
        console.log(storeFile({ 'file_path': `/assignments?file_name=${file_name}`, 'name': file.originalname }));
        cb(null, file_name)
    }
})
var upload = multer({ storage: storage })
router.get('/', (req, res) => {
    res.sendFile('display-tests.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
})

router.get('/start-test', (req, res) => {
    res.sendFile('test.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
})
router.get('/score-board', (req, res) => {
    res.sendFile('score_board.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
})
router.post('/storeScore', (req, res) => {
    name = req.body['name'];
    const user = new User(req.body);
    user.save()
        .then((user) => {
            res.status(200).json({ 'Status': `submission of user ${user.emailId} recorder successfully!` })
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Something went wrong')
        })
})
router.post('/getUsersByTestId', (req, res) => {
    const query = User.find({ testId: req.body['testId'] }, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ 'status': 'something went wrong' })
        }
    });
})

router.get('/upload-assignment', (req, res) => {
    res.sendFile('upload_assignment.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
})

// console.log(name)
router.post('/store-assignment', upload.single('filename'), (req, res) => {
    return res.status(200).json({ 'status': 'file uploaded successfully' });

})

router.get('/show-assignments', (req, res) => {
    res.sendFile('display_assignments.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))

})
router.post('/getAssignments', (req, res) => {
    const query = Assignment.find({}, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ 'status': 'something went wrong' })
        }
    }); req.params.filename
})

router.get('/assignments', (req, res) => {
    console.log(`File name ${req.query.file_name}`)
    res.sendFile(req.query.file_name, { root: path.join(__dirname, '../..', 'public', 'assignments') }, (err) => console.log(err))
})
module.exports = router;