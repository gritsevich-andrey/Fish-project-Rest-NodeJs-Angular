const Cabinet = require('../models/Cabinet')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const cabinets = await Cabinet.find({user: req.user.id});
        res.status(200).json(cabinets);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.getByEmail = async function (req, res) {
    try {
        const cabinet = await Cabinet.find(req.params.email);
        res.status(200).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.remove = async function (req, res) {
    try {
        await Cabinet.remove({_id: req.params.id});
        res.status(200).json({
            message: 'Кабинет был удален'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.create = function (req, res) {
    try {
        const cabinet = new Cabinet(
            {
            email: req.body.email,
            fio: req.body.fio,
            avatar: req.file ? req.file.path : '',
            gender: req.body.gender,
            age: req.body.age,
            technique: req.body.technique,
            juridicalPerson: req.body.juridicalPerson,
            date: Date.now()
        }).save();
        res.status(201).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = async function (req, res) {
    const updated = {
        fio: req.body.fio,
        avatar: req.body.avatar,
        age: req.body.age,
        gender: req.body.gender,
        technique: req.body.technique,
        juridicalPerson: req.body.juridicalPerson,
        date: Date.now
    }

    if (req.file) {
        updated.avatar = req.file.path
    }
    try {
        const cabinet = await Cabinet.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
