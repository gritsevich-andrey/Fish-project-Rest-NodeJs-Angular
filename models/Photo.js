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

    banDescription: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    likesCount: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    address: {
        type: String
    },
    comments: [{
        email: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }]
});
module.exports = mongoose.model('photos', photoSchema);
