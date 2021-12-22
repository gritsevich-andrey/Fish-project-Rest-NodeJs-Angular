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
        .then(photos => res.status(200).json(photos))
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
            userFIO: req.body.userFIO
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
        userFIO: req.body.userFIO
    }
    if (req.file) {
        updated.imageSrc = req.file.path;
    }
    Travel.findOneAndUpdate({_id: req.params.id}, updated).then(travel => res.status(200).json(travel))
        .catch(e => errorHandler(res, e))
}

module.exports.join = async function (req, res) {
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
        res.status(403).json({message: 'Пользователь уже присоединился'})
    }
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