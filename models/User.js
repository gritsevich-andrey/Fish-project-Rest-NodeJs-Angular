const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum: ['USER', 'ADMIN', 'MODERATOR', 'SUPER-ADMIN'],
        default: ['USER']
    },
    reviews:[{
        senderEmail: {type: String, default: ''},
        reviewMessage: {type: String, default: ''},
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    rating: {
        type: Number,
        default: 0
    },
    banned: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('users', userSchema);
