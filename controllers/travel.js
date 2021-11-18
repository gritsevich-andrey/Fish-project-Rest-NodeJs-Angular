const Travel = require('../models/Travel')
const errorHandler = require('../utils/errorHandler')

module.exports.getTravelByUserEmail = (req, res) => {
    Travel.find({userEmail: req.params.userEmail})
        .then(photos => res.status(200).json(photos))
        .catch(e => errorHandler(res, e))
}

module.exports.getAllTravels = (req, res) => {
    Travel.find()
        .then(travels =>
            res.status(200).json(travels))
        .catch(e => errorHandler(res, e))
}

module.exports.getTravelById = function (req, res) {
    Travel.findById({_id: req.params.id})
        .then(travel => res.status(200).json(travel))
        .catch(e => errorHandler(res, e))
}

module.exports.create = function (req, res) {
    try {
        const travel = new Travel({
            userEmail: req.body.userEmail,
            travelType: req.body.travelType,
            travelTarget: req.body.travelTarget,
            peoplesCount: req.body.peoplesCount,
            costPerPeople: req.body.costPerPeople,
            description: req.body.description,
            title: req.body.title,
            coordinates: {
                startPoint: {
                    latitude: req.body.coordinates.startPoint.latitude,
                    longitude: req.body.coordinates.startPoint.longitude
                },
                endPoint: {
                    latitude: req.body.coordinates.endPoint.latitude,
                    longitude: req.body.coordinates.endPoint.longitude
                }
            },
            isPublic: true,
            travelTechnique: req.body.travelTechnique
        }).save();
        res.status(201).json(travel);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.remove = function (req, res) {
    Travel.remove({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Поездка удалена.'}))
        .catch(e => errorHandler(res, e))
}

module.exports.update = function (req, res) {
    const updated = {
        userEmail: req.body.userEmail,
        travelType: req.body.travelType,
        travelTarget: req.body.travelTarget,
        peoplesCount: req.body.peoplesCount,
        costPerPeople: req.body.costPerPeople,
        description: req.body.description,
        title: req.body.title,
        coordinates: {
            startPoint: {
                latitude: req.body.coordinates.startPoint.latitude,
                longitude: req.body.coordinates.startPoint.longitude
            },
            endPoint: {
                latitude: req.body.coordinates.endPoint.latitude,
                longitude: req.body.coordinates.endPoint.longitude
            }
        },
        isPublic: req.body.isPublic,
        travelTechnique: req.body.travelTechnique
    }
    Travel.findOneAndUpdate({
        _id: req.params.id,
        $set: updated,
        new: true
    }).then(travel => res.status(200).json(travel))
        .catch(e => errorHandler(res, e))
}