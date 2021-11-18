const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
    },
    travelType: {
        type: String,
        required: true,
    },
    travelTarget: {
        type: String,
        required: true,
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
    coordinates: {
        type: String,
        required: true,
    },
    coordinates: {
        startPoint: {
            //Широта
            latitude: {
                type: String,
                required: true,
            },
            //Долгота
            longitude: {
                type: String,
                required: true,
            }
        },
        endPoint: {
            //Широта
            latitude: {
                type: String,
                required: true,
            },
            //Долгота
            longitude: {
                type: String,
                required: true,
            }
        }
    },
    isPublic: {
        type: Boolean,
        required: true,
    }
})
module.exports = mongoose.model('travels', travelSchema)
