const mongoose = require('mongoose');
const {v4} = require("uuid");
const Schema = mongoose.Schema;
const commentsSchema = new Schema({
    photoId: {
        type: String,
        required: true
    },
    comments: [{
        userEmail: {type: String, required: true},
        commentId: {type: String, default: v4()},
        commentValue: {type: String, required: true}
    }],
});
module.exports = mongoose.model('comments', commentsSchema);