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
                    juridicalPerson: req.body.juridicalPerson,
                    reviews: req.body.reviews,
                    ratings: req.body.ratings,
                    countRating: req.body.countRating
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
        juridicalPerson: req.body.juridicalPerson,
        reviews: req.body.reviews,
        ratings: req.body.ratings,
        countRating: req.body.countRating
    }

    if (req.file) {
        updated.avatar = req.file.path
    }
    try {
        const cabinet = await Cabinet.updateOne(
            {email: req.body.email},
            {$set: updated},
            {upsert: true},
        )
        res.status(200).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.updateReview = async function (req, res) {
    const updated = {
        userEmail: req.body.userEmail,
        reviewText: req.body.reviewText
    }
    try {
        const cabinetFind = await Cabinet.findOne({email: req.params.email});
        const cabinet = await cabinetFind.updateOne({
            $push: {
                reviews: {
                    userEmail: req.body.userEmail,
                    reviewText: req.body.reviewText
                }
            }
        })
        res.status(201).json(cabinet);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.updateRating = function (req, res) {
    const updated = {
        travelTitle: req.body.travelTitle,
        travelId: req.body.travelId,
        sumValue: req.body.sumValue
    }
    Cabinet.findOne({email: req.params.email})
        .then(cabinet => {
            cabinet.updateOne({
                $push: {
                    ratings: {
                        travelTitle: req.body.travelTitle,
                        travelId: req.body.travelId,
                        sumValue: req.body.sumValue
                    }
                }
            })
                .then(value => res.status(201).json(value))
                .catch(e => errorHandler(res, e));
        })
        .catch(e => errorHandler(res, e));
}

module.exports.getFIO = async function (req, res) {
    try {
        let data = []
        for (let i = 0; req.body.emails.length > i; i++) {
            let email = req.body.emails[i]
            let user = await Cabinet.findOne({email: email});
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
