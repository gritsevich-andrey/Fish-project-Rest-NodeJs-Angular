const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userEmail: {
        type: String,
        unique: true,
    },
    receiverEmail: {
        type: String,
        default: ''
    },
    passenger: [{
        email: {type: String, required: true},
        receiverEl: {type: String, default: ''},
        message: {type: String, default: ''},
        date: {type: Date, default: Date.now()}
    }]
});

module.exports = mongoose.model('chats', chatSchema);
