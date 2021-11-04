const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    targetEmail: {
        type: String,
        default: ''
    },
});

module.exports = mongoose.model('chats', chatSchema);
