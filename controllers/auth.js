const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Cabinet = require('../models/Cabinet');
const {v4} = require('uuid');
const nodemailer = require('nodemailer')
const errorHandler = require('../utils/errorHandler');
const validatePassword = require('../middleware/validatePassword');

module.exports.login = async function (req, res) {
    //phone
    const candidate = await User.findOne({email: req.body.email}).select('email password role banned _id');
    if ((candidate) && (candidate['banned'])) {
        res.status(403).json({
            message: 'Ваш аккаунт заблокирован. Обратитесь к администратору'
        })
        return;
    }
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
    } else {
        res.status(404).json({
            message: 'Пользователь с таким email не найден'
        })
    }

}


module.exports.register = async function (req, res) {
    const errors = validatePassword(req.body.password);
    if (errors.length > 0) {
        const errorMessage = getErrorMessage(errors);
        res.status(400).json({message: errorMessage});
    } else {
        const candidate = await User.findOne({email: req.body.email}).select('email');
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
                banned: req.body.banned,
                review: req.review
            });
            const cabinet = new Cabinet({
                email: req.body.email
            })
            try {
                await user.save()
                await cabinet.save()
                res.status(201).json(user);
            } catch (e) {
                errorHandler(res, e);
            }
        }
    }
}
module.exports.getAll = async function (req, res) {
    try {
        const users = await User.find();
        let resData = [];
        users.map(item => {
            let emailBanned = {email: item.email, banned: item.banned}
            resData.push(emailBanned)
        });
        res.status(200).json(resData);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.restorePassword = async function (req, res) {
    try {
        const password = v4()
        const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        const user = await User.findOneAndUpdate({email: req.body.email}, {password: hashPassword})
        if (user) {
            let transporter = nodemailer.createTransport({
                host: 'onloc.ru',//?
                port: 465,//?
                secure: true,//?
                auth: {
                    user: 'robot@onloc.ru',
                    pass: 'robot89354' //robot89354!
                }
            })
            let mailOptions = {
                from: 'robot@onloc.ru',
                to: req.body.email,
                subject: 'Восстановление пароля',
                html: `Новый пароль для вашего аккаунта - <b>${password}</b>, перейлите по ссылке и войдите в свой аккаунт с
                новым паролем <a href="https://scary-grave-23217.herokuapp.com/login">ВОЙТИ</a>`
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).json({
                        message: 'Письмо с новым паролем было отправлено на почту.'
                    })
                }
            })
        } else {
            res.status(404).json({
                message: `Пользователь с email ${req.body.email} не зарегистрирован.`
            })
        }
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = function (req, res) {
    const update = {
        review: req.body.review,
        rating: req.body.rating
    }
    User.findOneAndUpdate(
        {email: req.body.email},
        {$set: update},
        {new: true}
    )
        .then(user => res.status(200).json(user))
        .catch(err => errorHandler(res, err))
}

function getErrorMessage(errors) {
    let errorMessage = '';
    for (let errorsKey in errors) {
        switch (errors[errorsKey]) {
            case 'uppercase':
                errorMessage = 'Пароль должен содержать хотя бы одну большую букву';
                break;
            case 'lowercase':
                errorMessage = 'Пароль должен содержать хотя бы одну малую букву';
                break;
            case 'digits':
                errorMessage = 'Пароль должен содержать хотя бы одну цифру';
                break;
            case 'min':
                errorMessage = 'Минимальная величина пароля 6 символов';
                break;
            case 'max':
                errorMessage = 'Слишком большой пароль';
                break;
            default:
                break;
        }
    }
    return errorMessage;
}
