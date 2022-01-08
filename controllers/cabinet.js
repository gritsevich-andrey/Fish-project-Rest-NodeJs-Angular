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
        countRating: req.body.countRating,
        inn: req.body.inn,
        kpp: req.body.kpp,
        organizationName: req.body.organizationName
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
module.exports.updateReview = function (req, res) {
    Cabinet.findOne({email: req.params.email})
        .then(cabinetFind => {
            cabinetFind.updateOne({
                $push: {
                    reviews: {
                        userEmail: req.body.userEmail,
                        travelId: req.body.travelId,
                        reviewText: req.body.reviewText,
                        userFIO: req.body.userFIO
                    }
                }
            })
                .then(cabinet => res.status(201).json(cabinet))
                .catch(e => errorHandler(res, e))
        })
        .catch(e => errorHandler(res, e))
}

module.exports.updateRating = function (req, res) {
    Cabinet.findOne({email: req.params.email})
        .then(cabinet => {
            cabinet.updateOne({
                $push: {
                    ratings: {
                        travelId: req.body.travelId,
                        travelName: req.body.travelName,
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

module.exports.getRating = function (req, res) {
    Cabinet.findOne({email: req.params.email})
        .then(cabinet => {
            let travelRating = [];
            cabinet.ratings
                .map(value => {
                    const travelIdParam = req.params.travelId;
                    if (value.sumValue !== 0) {
                        if (value.travelId !== "" && value.travelId === req.params.travelId) {
                            if (value.sumValue !== 0) {
                                travelRating.push({travelId: travelIdParam, ratingValue: value.sumValue});
                            }
                        }
                    }
                })
            console.log(' Ratings', travelRating);
            res.status(200).json(travelRating);
        })
        .catch(e => errorHandler(res, e))
}

module.exports.getCabinetsWithReviews = (req, res) => {
    Cabinet.find({$where: 'this.reviews'}).then(cabinets => {
        res.status(200).json(cabinets)
    })
}

module.exports.updateReviewShown = (req, res) => {
    Cabinet.updateOne(
        {
            reviews: {$elemMatch: {_id: req.body.id}},
            'reviews._id': req.body.id,
        },
        {
            $set: {
                "reviews.$.isShown": req.body.status,
                "reviews.$.rejectionReason": req.body.rejectionReason
            }
        },
    ).then(() => res.status(200).json({message: 'Обновлено успешно'}))
}

module.exports.getUserReviews = (req, res) => {
    Cabinet.find({reviews: {$elemMatch: {userEmail: req.params.email}}})
        .then(cabinets => {
            let reviews = []
            cabinets.map(cabinet => reviews.push(...cabinet.reviews))
            let userReviews = reviews.filter(review => review.userEmail === req.params.email)
            res.status(200).json(userReviews)
        })
}
