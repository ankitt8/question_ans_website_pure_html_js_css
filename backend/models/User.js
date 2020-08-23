const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullName: {
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
    }
})

module.exports = mongoose.model('User', UserSchema)