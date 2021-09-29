const User = require('../models/User')

module.exports.login = function (req, res) {
    res.status(200).json({
        login: {
            email: req.body.email,
            password: req.body.password
        }
    })
}
module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        //Вернуть ошибку
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        });
    } else {
        const user = new User({
            email: req.body.email,
            password: req.body.password
        });
        user.save().then(() => console.log('User is created'));
    }


}
