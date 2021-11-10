const mongoose = require('mongoose');
const {v4} = require("uuid");
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
    complaints: [{
        complaintId: {type: String, default: v4()},
        complaintDescription: {type: String, required: true, default: ''}
    }],
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('complaint', complaintsSchema);
