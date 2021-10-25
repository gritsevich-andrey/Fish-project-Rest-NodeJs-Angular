const Photo = require('../models/Foto')
const errorHandler = require('../utils/errorHandler')

module.exports.getPhotoByUserId = async function (req, res) {
    try {
        const photos = await Photo.find({userId: req.params.userId});
        res.status(200).json(photos);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.getPhotoById = async function (req, res) {
    try {
        const photos = await Photo.find({_id: req.params.id});
        res.status(200).json(photos);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.create = function (req, res) {
    try {
        const photo = new Photo({
            imageSrc: req.file ? req.file.path : '',
            userId: req.body.userId,
            coordinates: req.body.coordinates,
            description: req.body.description,
            moderation: req.body.moderation,
            public: req.body.public
        }).save();
        res.status(201).json(photo);
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.remove = async function (req, res) {
    try {
        await Photo.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Фотография удалена.'
        })
    } catch (e) {
        errorHandler(res, e);
    }

}
module.exports.update = async function (req, res) {
    const updated = {
        imageSrc: req.file ? req.file.path : '',
        userId: req.body.userId,
        coordinates: req.body.coordinates,
        description: req.body.description,
        moderation: req.body.moderation,
        public: req.body.public
    }
    if (req.file) {
        updated.imageSrc = req.file.path
    }
    try {
        const photo = await Photo.findOneAndUpdate({
            _id: req.params.id,
            $set: updated,
            new: true
        })
        res.status(200).json(photo);
    } catch
        (e) {
        errorHandler(res, e);
    }
}