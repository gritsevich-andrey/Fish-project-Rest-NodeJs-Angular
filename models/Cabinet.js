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
    },
    gender: {
        type: String,
        default: ''
    },
    age: {
        type: String,
    },
    technique: {
        type: [],
        default: [{name: '', license: ''}]
    },
    juridicalPerson: {
        type: String,
        default: 'Физическое лицо'
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
