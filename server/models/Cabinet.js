const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cabinetSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fio: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: ''
    },
    age: {
        type: Number
    },
    technique: [{
        name: {type: String , default: ''},
        techPassport: {type: String, default: ''},
        driverLicense: {type: String, default: ''}
    }],
    juridicalPerson: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('cabinets', cabinetSchema)
