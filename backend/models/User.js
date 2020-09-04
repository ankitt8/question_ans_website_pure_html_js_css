const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    emailId: {
        type: String
    },
    marks: {
        type: Number
    },
    dateTestTaken: {
        type: Date,
        default: Date.now()
    },
    timeTakenInMinutes: {
        type: String
    },
    score: {
        type: Number
    },
    timeTaken: {
        type: Number
    }, 
    testId: {
        type: String
    }
})

module.exports = mongoose.model('User', UserSchema)