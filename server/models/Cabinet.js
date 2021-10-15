const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cabinetSchema = new Schema({
    fio: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        required: true
    },
    technique: [{
        name: {type: String , default: ''},
        techPassport: {type: String, default: ''},
        driverLicense: {type: String, default: ''}
    }],
    juridicalPerson: {
        type: Boolean,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('cabinets', cabinetSchema)
