const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const photoSchema = new Schema({
    imageSrc: {
        type: String,
        required: true
    },
    userId: {
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
    }
});
module.exports= mongoose.model('photos', photoSchema);