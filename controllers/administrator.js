const User = require("../models/User");
const Cabinet = require('../models/Cabinet')
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = function (req, res) {
    User.find().then(users => {
        let resData = [];
        Cabinet.find().then(cabinet => {
            users.forEach(item => {
                let data = {email: item.email, banned: item.banned}
                cabinet.forEach(el => {
                    if (el.email === item.email) {
                        data.fio = el.fio
                        data.date = el.date
                    }
                })
                resData.push(data)
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
