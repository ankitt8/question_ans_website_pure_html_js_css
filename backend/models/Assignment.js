const mongoose = require('mongoose')
const AssignmentSchema = new mongoose.Schema({
    file_path: {
        type: String
    },
    name: {
        type: String
    }
})

module.exports = mongoose.model('Assignment', AssignmentSchema);