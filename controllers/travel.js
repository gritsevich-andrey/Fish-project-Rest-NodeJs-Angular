const Travel = require('../models/Travel')
const Cabinet = require('../models/Cabinet')
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
        .then(travels => res.status(200).json(travels))
        .catch(e => errorHandler(res, e))
}

module.exports.getAllTravels = (req, res) => {
    Travel.find()
        .then(travels => res.status(200).json(travels))
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
            isOrganizer: req.body.isOrganizer,
            name: req.body.name,
            userFIO: req.body.userFIO,
            fromAddress: req.body.fromAddress
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
        isPublic: req.body.isPublic,
        travelTechnique: req.body.travelTechnique,
        date: req.body.date,
        address: req.body.address,
        fromAddress: req.body.fromAddress,
        isOrganizer: req.body.isOrganizer,
        name: req.body.name,
        userFIO: req.body.userFIO,
        queryDelete: req.body.queryDelete,
    }
    if (req.file) {
        updated.imageSrc = req.file.path;
    }
    if (req.body.startPoint) {
        updated.startPoint = JSON.parse(req.body.startPoint)
    }
    if (req.body.endPoint) {
        updated.endPoint = JSON.parse(req.body.endPoint)
    }
    Travel.findOneAndUpdate({_id: req.params.id}, updated)
        .then(travel => res.status(200).json(travel))
        .catch(e => errorHandler(res, e))
}

module.exports.join = async function (req, res) {
    try {
        const cabinet = await Cabinet.findOne({email: req.body.userEmail})
        const travel = await Travel.findOne({_id: req.body.travelId})
        const userAlreadyJoined = travel.joinedUsers.some(user => user.userEmail === req.body.userEmail)

        if (!userAlreadyJoined) {
            let userData = {
                userEmail: req.body.userEmail,
            }
            if (!cabinet?.fio) {
                userData.nickName = req.body.userEmail.split('@')[0]
            } else {
                userData.fio = cabinet.fio
            }

            await travel.updateOne({
                $push: {
                    joinedUsers: userData
                }
            })
            res.status(200).json({message: 'Пользователь присоединился'})
        } else {
            res.status(403).json({message: 'Пользователь уже присоединился к этой поездке'})
        }
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.changeUserStatus = function (req, res) {
    Travel.updateOne({_id: req.body.travelId, 'joinedUsers.userEmail': req.body.userEmail}, {
        'joinedUsers.$.status': req.body.status,
    })
        .then(() => res.status(200).json({message: 'статус обновлен'}))
        .catch(e => errorHandler(res, e))
}

module.exports.updateUserComment = function (req, res) {
    Travel.updateOne({_id: req.body.travelId, 'joinedUsers.userEmail': req.body.userEmail}, {
        'joinedUsers.$.comment': req.body.comment,
    })
        .then(() => res.status(200).json({message: 'комментарий был обновлен'}))
        .catch(e => errorHandler(res, e))
}

module.exports.updateUserRating = function (req, res) {
    Travel.updateOne({_id: req.body.travelId, 'joinedUsers.userEmail': req.body.userEmail}, {
        'joinedUsers.$.rating': req.body.rating,
        'joinedUsers.$.isRatingSet': true
    })
        .then(() => res.status(200).json({message: 'рейтинг был обновлен'}))
        .catch(e => errorHandler(res, e))
}

module.exports.updateUserTravelRating = function (req, res) {
    Travel.updateOne({_id: req.body.travelId, 'joinedUsers.userEmail': req.body.userEmail}, {
        'joinedUsers.$.travelRating': req.body.travelRating,
        'joinedUsers.$.isTravelRatingSet': true
    })
        .then(() => res.status(200).json({message: 'рейтинг был обновлен'}))
        .catch(e => errorHandler(res, e))
}

module.exports.updateUserReview = function (req, res) {
    Travel.updateOne({_id: req.body.travelId, 'joinedUsers.userEmail': req.body.userEmail}, {
        'joinedUsers.$.isReviewSet': true
    })
        .then(() => res.status(200).json())
        .catch(e => errorHandler(res, e))
}

module.exports.updateUserTravelReview = function (req, res) {
    Travel.updateOne({_id: req.body.travelId, 'joinedUsers.userEmail': req.body.userEmail}, {
        'joinedUsers.$.isTravelReviewSet': true
    })
        .then(() => res.status(200).json())
        .catch(e => errorHandler(res, e))
}

module.exports.changeTravelStatus = function (req, res) {
    Travel.findOneAndUpdate({_id: req.body.travelId}, {status: req.body.status})
        .then(() => res.status(200).json({message: 'статус обновлен'}))
        .catch(e => errorHandler(res, e))
}

module.exports.leave = (req, res) => {
    Travel.updateOne({_id: req.body.travelId}, {
        $pull: {joinedUsers: {userEmail: req.body.userEmail}}
    })
        .then(() => res.status(200).json('Вы успешно покинули поездку'))
        .catch(e => errorHandler(res, e))
}
