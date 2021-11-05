const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    driverEmail: {
        type: String,
        unique: true,
        default: ''
    },
    passenger: [{
        email: {type: String, required: true},
        message: {type: String, default: ''},
        date: {type: Date, default: Date.now()}
    }]
});

module.exports = mongoose.model('chats', chatSchema);
