const Chat = require('../models/Chat')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const chats = await Chat.find({user: req.user.id});
        res.status(200).json(chats);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getByEmail = async function (req, res) {
    try {
        const chat = await Chat.findOne({email: req.params.email});
        console.log(chat)
        res.status(200).json(chat);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Chat.remove({_id: req.params.id});
        res.status(200).json({
            message: 'Кабинет был удален'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.create = async function (req, res) {
    try {
        const isChat = await Chat.findOne({email: req.body.email});
        if (!isChat) {
            const chat = new Chat(
                {
                    email: req.body.email,
                    targetEmail: req.body.targetEmail,
                    message: req.body.message
                }).save();
            res.status(201).json(chat);
        } else {
            res.status(404).json('Ошибка сохранения данных о кабинете');
        }
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = async function (req, res) {
    const updated = {
        email: req.body.email,
        targetEmail: req.body.targetEmail,
        message: req.body.message
    }

    try {
        const cabinet = await Chat.findOneAndUpdate(
            {email: req.body.email},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
