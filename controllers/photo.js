const Photo = require('../models/Photo')
const errorHandler = require('../utils/errorHandler')
const Comments = require("../models/Comments");

module.exports.getPhotoByUserEmail = (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userPhotos = Photo.find({userEmail: req.params.userEmail})
    if (pageSize && currentPage) {
        userPhotos
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    userPhotos
        .then(photos => res.status(200).json(photos))
        .catch(e => errorHandler(res, e))
}

module.exports.getAllPhoto = (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const photoQuery = Photo.find();
    if (pageSize && currentPage) {
        photoQuery.skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    photoQuery
        .then(photos => {
            res.status(200).json(photos)
        })
        .catch(e => errorHandler(res, e))
}

module.exports.getPhotoById = function (req, res) {
    Photo.findById({_id: req.params.id})
        .then(photo => res.status(200).json(photo))
        .catch(e => errorHandler(res, e))
}

module.exports.create = async function (req, res) {
    try {
        const photo = await new Photo({
            imageSrc: req.file ? req.file.path : '',
            userEmail: req.body.email,
            coordinates: req.body.coordinates,
            description: req.body.description,
            moderation: req.body.moderation,
            public: req.body.public
        }).save()
        await new Comments({
            photoId: photo._id,
            comments: []
        }).save()

        res.status(201).json(photo);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.remove = function (req, res) {
    Photo.remove({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Фотография удалена.'}))
        .then(() => Comments.remove({photoId: req.params.id}))
        .catch(e => errorHandler(res, e))
}

module.exports.update = function (req, res) {
    const updated = {
        imageSrc: req.file ? req.file.path : req.body.imageSrc,
        userEmail: req.body.userEmail,
        coordinates: req.body.coordinates,
        description: req.body.description,
        moderation: req.body.moderation,
        public: req.body.public,
        banDescription: req.body.banDescription
    }
    if (req.file) {
        updated.imageSrc = req.file.path
    }
    Photo.findOneAndUpdate({_id: req.body.fotoId}, updated)
        .then(photo => res.status(200).json(photo))
        .catch(e => errorHandler(res, e))
}

module.exports.setLikes = function (req, res) {
    Photo.findOne({_id: req.body.imageId})
        .then(data => Photo.updateOne({_id: req.body.imageId}, {likesCount: data.likesCount + 1}))
        .then(() => res.status(200).json({message: `Success set like at image ${req.body.imageId}`}))
        .catch(e => errorHandler(res, e))
}