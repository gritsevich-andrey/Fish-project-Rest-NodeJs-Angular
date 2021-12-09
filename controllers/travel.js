const Travel = require('../models/Travel')
const errorHandler = require('../utils/errorHandler')

module.exports.getTravelByUserEmail = (req, res) => {
    Travel.find({
        $or: [
            {
                userEmail: req.params.userEmail
            },
            {
                joinedUsers: {$elemMatch: {userEmail: req.params.userEmail}}
            }
        ]
    })
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
            imageSrc: req.file ? req.file.path : '',
            userEmail: req.body.userEmail,
            travelType: req.body.travelType,
            travelTarget: req.body.travelTarget,
            peoplesCount: req.body.peoplesCount,
            costPerPeople: req.body.costPerPeople,
            description: req.body.description,
            title: req.body.title,
            startPoint: JSON.parse(req.body.startPoint),
            endPoint: JSON.parse(req.body.endPoint),
            isPublic: true,
            travelTechnique: req.body.travelTechnique,
            date: req.body.date,
            address: req.body.address,
            isOrganizer: req.body.isOrganizer
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
        startPoint: JSON.parse(req.body.startPoint),
        endPoint: JSON.parse(req.body.endPoint),
        isPublic: req.body.isPublic,
        travelTechnique: req.body.travelTechnique,
        date: req.body.date,
        address: req.body.address,
        isOrganizer: req.body.isOrganizer,
        name: req.body.name,
    }
    if (req.file) {
        updated.imageSrc = req.file.path;
    }
    Travel.findOneAndUpdate({_id: req.params.id}, updated).then(travel => res.status(200).json(travel))
        .catch(e => errorHandler(res, e))
}

module.exports.join = function (req, res) {
    Travel.findById(req.body.id).then(data => {
        data.updateOne({
            $push: {
                joinedUsers: {
                    userEmail: req.body.email
                }
            }
        }).then(() => res.status(200).json({message: 'пользователь успешно присоединился'}))
    })
}

module.exports.changeUserStatus = function (req, res) {
    Travel.findById(req.body.travelId)
        .then(data => {
            let userIndex = data.joinedUsers.findIndex(el => el.userEmail === req.body.userEmail)
            data.update({
                '$set': {
                    [`joinedUsers.${userIndex}.status`]: req.body.status
                }
            }).then(() => {
                res.status(200).json({message: 'статус обновлен'})
            })
        })
}

module.exports.updateUserComment = function (req, res) {
    Travel.findById(req.body.travelId)
        .then(data => {
            let userIndex = data.joinedUsers.findIndex(el => el.userEmail === req.body.userEmail)
            data.update({
                '$set': {
                    [`joinedUsers.${userIndex}.comment`]: req.body.comment
                }
            }).then(() => {
                res.status(200).json({message: 'комментарий обновлен'})
            })
        })
}

module.exports.changeTravelStatus = function (req, res) {
    Travel.findOneAndUpdate({_id: req.body.travelId}, {status: req.body.status})
        .then((data) => res.status(200).json({message: 'статус обновлен'}))
}