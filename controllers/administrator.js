const User = require("../models/User");
const Cabinet = require('../models/Cabinet')
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = function (req, res) {
    User.find().then(users => {
        let resData = [];
        Cabinet.find().then(cabinet => {
            users.forEach(user => {
                let userData = {
                    email: user.email,
                    banned: user.banned,
                    registrationDate: user.registrationDate,
                    role: user.role
                }
                cabinet.forEach(cabinet => {
                    if (cabinet.email === user.email) {
                        userData.fio = cabinet.fio
                        userData.complaints = cabinet.complaints
                    }
                })
                resData.push(userData)
            })
            res.status(200).json(resData)
        })
    });
}

module.exports.banById = async function (req, res) {
    try {
        await User.updateOne({email: req.body.email}, {banned: true});
        res.status(200).json({
            message: `Пользователь ${req.body.email} был забанен`
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.unBanById = async function (req, res) {
    try {
        await User.updateOne({email: req.body.email}, {banned: false});
        res.status(200).json({
            message: `Пользователь ${req.body.email} был разбанен`
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.updateRole = (req, res) => {
    User.findOneAndUpdate({email: req.body.email}, {role: req.body.role})
        .then(() => res.status(200).json({message: 'Роль обновлена'}))
        .catch(error => console.log(error))
}