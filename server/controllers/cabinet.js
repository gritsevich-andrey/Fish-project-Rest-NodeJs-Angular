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
        const cabinet = await Cabinet.findOne(req.params.email);
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
module.exports.create = async function (req, res) {
    try {
        const isCabinet = await Cabinet.findOne({email: req.body.email});
        if (!isCabinet) {
        const cabinet = new Cabinet(
            {
                email: req.body.email,
                fio: req.body.fio,
                avatar: req.file ? req.file.path : '',
                gender: req.body.gender,
                age: req.body.age,
                technique: req.body.technique,
                juridicalPerson: req.body.juridicalPerson
            }).save();
            res.status(201).json(cabinet);
        }
        else {
            const updated = {
                fio: req.body.fio,
                avatar: req.file ? req.file.path : '',
                age: req.body.age,
                gender: req.body.gender,
                technique: req.body.technique,
                juridicalPerson: req.body.juridicalPerson
            }
            if (req.file) {
                updated.avatar = req.file.path
            }
             await Cabinet.findOneAndUpdate(
                {email: req.body.email},
                {$set: updated},
                {new: true}
            )
            res.status(200).json(updated);
        }
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = async function (req, res) {
    const updated = {
        fio: req.body.fio,
        avatar: req.file ? req.file.path : '',
        age: req.body.age,
        gender: req.body.gender,
        technique: req.body.technique,
        juridicalPerson: req.body.juridicalPerson
    }

    if (req.file) {
        updated.avatar = req.file.path
    }
    try {
        const cabinet = await Cabinet.findOneAndUpdate(
            {_id: req.params.email},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
