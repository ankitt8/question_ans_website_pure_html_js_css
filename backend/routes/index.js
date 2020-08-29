const express = require('express')
const router = express.Router();
const path = require('path')
const User = require('../models/User')

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../..', 'public') }, (err) => console.log(err))
    // res.sendFile('index.html')
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

router.get('/getUsers', (req, res) => {
    const query = User.find({}, (err, result) => {
        console.log(result)
    });
    console.log(query)
    return 
})

module.exports = router;