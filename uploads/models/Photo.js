const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const photoSchema = new Schema({
    imageSrc: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        default: ''
    },
    coordinates: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    moderation: {
        type: Boolean,
        default: false
    },
    public: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    banDescription: {
        type: String,
        default: ''
    },
    likesCount: {
        type: Number,
        default: 0
    }
});
module.exports= mongoose.model('photos', photoSchema);