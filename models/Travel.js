const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
    },
    userFIO: {
        type: String,
    },
    travelType: {
        type: String,
        required: true,
    },
    travelTarget: {
        type: String,
        default: '0'
    },
    travelTechnique: [{
        type: String,
        default: ''
    }],
    peoplesCount: {
        type: String,
        required: true,
    },
    costPerPeople: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: ''
    },
    startPoint: [{
        latitude: {type: Number},
        longitude: {type: Number}
    }],
    endPoint: [{
        latitude: {type: Number},
        longitude: {type: Number}
    }],
    isPublic: {
        type: Boolean,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    fromAddress: {
        type: String,
        default: '',
    },
    imageSrc: {
        type: String,
    },
    isOrganizer: {
        type: Boolean,
        default: false
    },
    joinedUsers: [
        {
            userEmail: {type: String},
            status: {type: String, default: 'Ожидает подтверждение от водителя'},
            comment: {type: String},
            fio: {type: String},
            nickName: {type: String},
        }
    ],
    status: {
        type: String,
        default: ''
    },
    queryDelete: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('travels', travelSchema)
