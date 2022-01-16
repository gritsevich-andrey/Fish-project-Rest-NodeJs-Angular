const Chat = require('../models/Chat')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = function (req, res) {
    Chat.find()
        .then(chats => res.status(200).json(chats.reverse()))
        .catch(e => errorHandler(res, e));
}

module.exports.getByEmail = function (req, res) {
        Chat.findOne({userEmail: req.params.email})
            .then(chat =>  res.status(200).json(chat))
            .catch(e => errorHandler(res, e))
}

module.exports.remove = async function (req, res) {
    try {
        await Chat.remove({_id: req.params.id});
        res.status(200).json({
            message: 'Чат был удален'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.create = async function (req, res) {
    try {
        const isChat = await Chat.findOne({userEmail: req.body.userEmail});
        if (!isChat) {
            const chat = new Chat(
                {
                    userEmail: req.body.userEmail,
                    receiverEmail: req.body.receiverEmail,
                    passenger: req.body.passenger
                }).save();
            res.status(201).json(chat);
        } else {
            const updated = {
                passenger: req.body.passenger
            }
            Chat.findOneAndUpdate(
                {userEmail: req.body.userEmail},
                {$push: updated},
                {new: true}
            )
                .then(chat => res.status(200).json(chat))
                .catch(e => console.log('Ошибка обновления чата', e))
        }
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = async function (req, res) {
    const updated = {
        userEmail: req.body.userEmail,
        receiverEmail: req.body.receiverEmail,
        passenger: req.body.passenger
    }

    try {
        const chat = await Chat.findOneAndUpdate(
            {userEmail: req.body.userEmail},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(chat);
    } catch (e) {
        errorHandler(res, e);
    }
}
