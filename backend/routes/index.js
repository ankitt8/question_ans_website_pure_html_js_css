const express = require('express')
const router = express.Router();
const path = require('path')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.sendFile('display-tests.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
    // res.sendFile('index.html')
})

router.get('/start-test', (req, res) => {
    res.sendFile('test.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
    // res.sendFile('index.html')
})
router.get('/score-board', (req, res) => {
    res.sendFile('score_board.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
})
router.post('/storeScore', (req, res) => {

    // console.log(req.body.emailId);
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
    const query = User.find({testId: req.body['testId']}, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }else {
            return res.status(400).json({'status':'something went wrong'})
        }
    });
    // console.log(query)
    
})
module.exports = router;