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

// module.exports.getByEmail = (req, res) => {
//     Cabinet.findOne({email:req.params.email})
//         .then(cabinet => {
//             if (cabinet) {
//                 res.status(200).json(cabinet);
//             } else {
//                 res.status(404).json({message: 'Кабинет не найден'})
//             }
//         })
//         .catch(e => {
//             res.status(404).json({message: 'Ошибка получения данных из базы'});
//             errorHandler(res, e);
//         })
// }

module.exports.getByEmail = async function (req, res) {
    try {
        const cabinet = await Cabinet.findOne({email: req.params.email});
        console.log(cabinet)
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
        } else {
            res.status(404).json('Ошибка сохранения данных о кабинете');
        }
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.update = async function (req, res) {
    const updated = {
        fio: req.body.fio,
        age: req.body.age,
        avatar: req.file ? req.file.path : '',
        gender: req.body.gender,
        technique: req.body.technique,
        juridicalPerson: req.body.juridicalPerson
    }

    if (req.file) {
        updated.avatar = req.file.path
    }
    try {
        const cabinet = await Cabinet.findOneAndUpdate(
            {email: req.body.email},
            {$set: updated},
            {new: true}
        )
        res.status(200).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.getFIO = async function (req, res) {
    try {
        let data = []
        console.log(req.body.emails)
        for (let i = 0; req.body.emails.length > i; i++) {
            let email = req.body.emails[i]
            let user = await Cabinet.find({email: email});
            data.push({
                email: email,
                fio: user.fio
            })
        }
        res.status(200).json(data);
    } catch (e) {
        errorHandler(res, e);
    }
}
