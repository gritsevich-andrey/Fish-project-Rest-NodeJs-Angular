const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
    description: {
        type: [String],
        required: true,
        default: []
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('complaint', complaintsSchema);
