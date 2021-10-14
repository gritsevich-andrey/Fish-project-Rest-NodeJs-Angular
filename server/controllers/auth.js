const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id,
                role: candidate.role
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: 'Пароли не совпали'
            })
        }
        //Проверяем пароль
    } else {
        res.status(404).json({
            message: 'Пользователь с таким email не найден'
        })
    }

}
module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
            role: req.body.role,
            banned: req.body.banned
        });
        try {
            await user.save()
            res.status(201).json(user);
        } catch (e) {
            errorHandler(res, e);
        }
    }
}
module.exports.getAll = async function (req, res) {
    try {
        const users = await User.find();
        let email = [];
        users.map(item => email.push(item.email, item.banned));
       // users.forEach((values) => {
       //     email.push(values.email);
       // })
       res.status(200).json(email);
    } catch (e) {
        errorHandler(res, e);
    }
}
