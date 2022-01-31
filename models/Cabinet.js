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
    ratings: [{
        travelName: {type: String, default: ''},
        travelId: {type: String, default: ''},
        sumValue: {type: Number, default: 0},
    }],
    reviews: [{
        userEmail: {type: String, default: ''},
        reviewText: {type: String, default: ''},
        travelId: {type: String, default: ''},
        date: {type: Date, default: Date.now},
        travelName: {type: String, default: ''},
        userFIO: {type: String, default: ''},
        isShown: {type: Boolean, default: true},
        rejectionReason: {type: String, default: ''}
    }],
    date: {
        type: Date,
        default: Date.now
    },
    organizationName: {
        type: String,
        default: ''
    },
    inn: {
        type: String,
        default: ''
    },
    kpp: {
        type: String,
        default: ''
    },
    complaints: [{
        description: {type: String, required: true},
        senderEmail: {type: String, required: true}
    }],
})
module.exports = mongoose.model('cabinets', cabinetSchema)
