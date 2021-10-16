const User = require("../models/User");
const Cabinet = require('../models/Cabinet')
const errorHandler = require("../utils/errorHandler");
const Complaint = require("../models/Complaint");

module.exports.getAll = async function (req, res) {
    try {
        const users = await User.find();
        let resData = [];
        for(let item of users) {
            let cabinetData = await Cabinet.findById(item._id);
            let data = {email: item.email, banned: item.banned, fio: cabinetData?.fio, date: cabinetData?.date}
            resData.push(data)
        }
        res.status(200).json(resData);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.banById = async function (req, res) {
    try {
        const user = await User.updateOne({email: req.body.email}, {banned: true});
        res.status(200).json({
            message: 'Пользователь был забанен'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.unBanById = async function (req, res) {
    try {
        const user = await User.updateOne({email: req.body.email}, {banned: false});
        res.status(200).json({
            message: 'Пользователь был разбанен'
        });
    } catch (e) {
        errorHandler(res, e);
    }
}