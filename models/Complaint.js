const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
    complaints: [{
        description: {type: String, required: true, default: ''},
        senderEmail: {type: String, required: true}
    }],
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('complaint', complaintsSchema);
