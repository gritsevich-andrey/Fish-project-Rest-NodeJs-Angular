const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
    UserEmail: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    },
    carrier: {
        type: String,
        default: 'Неизвестно'
    },
    place: {
        type: String,
        default: 'Неизвестно'
    }
})
module.exports = mongoose.model('travels', travelSchema)
