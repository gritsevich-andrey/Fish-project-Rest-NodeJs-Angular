const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
    complaints: [{
        complaintId: {type: String, required: true},
        complaintDescription: {type: String, required: true, default: ''}
    }],
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('complaint', complaintsSchema);
