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
module.exports.getById = async function (req, res) {
    try {
        const cabinet = await Cabinet.findById(req.params.id);
        res.status(200).json({cabinet});
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
    console.log('id Пользователя из контроллера Cabinet', req.user.id);
    try {
        const cabinet =  new Cabinet({
            fio: req.body.fio,
            gender: req.body.gender,
            age: req.body.age,
            technique: req.body.technique,
            juridicalPerson: req.body.juridicalPerson,
            imgSrc: req.file ? req.file.path : '',
            user: req.user.id,
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
        age: req.body.age,
        technique: req.body.technique,
        juridicalPerson: req.body.juridicalPerson,
        date: Date.now
    }

    if (req.file) {
        updated.imageSrc = req.file.path
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
