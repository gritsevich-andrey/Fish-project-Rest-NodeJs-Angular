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
            role: req.body. role,
            date: req.body.date,
            status: req.body.status,
            carrier: req.body.carrier,
            place: req.body.place

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
        role: req.body. role,
        date: req.body.date,
        status: req.body.status,
        carrier: req.body.carrier,
        place: req.body.place
    }
    Travel.findOneAndUpdate({
        _id: req.params.id,
        $set: updated,
        new: true
    }).then(travel => res.status(200).json(travel))
        .catch(e => errorHandler(res, e))
}