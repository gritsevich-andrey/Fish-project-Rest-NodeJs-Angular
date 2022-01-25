const Photo = require('../models/Photo')
const errorHandler = require('../utils/errorHandler')

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
    const photoQuery = Photo.find()
    if (pageSize && currentPage) {
        photoQuery
            .skip(pageSize * (currentPage - 1))
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
        new Photo({
            imageSrc: req.file ? req.file.path : '',
            userEmail: req.body.email,
            coordinates: req.body.coordinates,
            description: req.body.description,
            moderation: req.body.moderation,
            public: req.body.public,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            address: req.body.address,
        }).save().then(() => {
                res.status(201).json({message: 'Фото загружено'});
        })
    } catch (e) {
        errorHandler(res, e);
    }
}
module.exports.remove = function (req, res) {
    Photo.remove({_id: req.params.id})
        .then(() => res.status(200).json({message: 'Фотография удалена.'}))
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
        banDescription: req.body.banDescription,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        address: req.body.address,
        queryDeleted: req.body.queryDeleted
    }
    if (req.file) {
        updated.imageSrc = req.file.path
    }
    Photo.findOneAndUpdate({_id: req.body._id}, updated)
        .then(photo => res.status(200).json(photo))
        .catch(e => errorHandler(res, e))
}
module.exports.updatePublic =  function (req, res) {
        const updated = {
            public: req.body.public
        }
        Photo.findOneAndUpdate({_id: req.body.id}, updated)
          .then(photo => res.status(200).json(photo))
          .catch(e => errorHandler(res, e))
}


module.exports.incrementLikes = async (req, res) => {
    let photo = await Photo.findOne({_id: req.body.imageId})
    let likesCount = photo.likesCount + 1
    await Photo.findOneAndUpdate({_id: req.body.imageId}, {likesCount})
    res.status(200).json({message: 'Успешно обновлено количество лайков'})
}

module.exports.decrementLikes = async (req, res) => {
    let {likesCount} = await Photo.findOne({_id: req.body.imageId})
    likesCount -= 1
    await Photo.findOneAndUpdate({_id: req.body.imageId}, {likesCount})
    res.status(200).json({message: 'Успешно обновлено количество лайков'})
}

module.exports.setComment = (req, res) => {
    Photo.findOneAndUpdate({_id: req.body.imageId}, {
        $push: {
            comments: {
                email: req.body.email,
                value: req.body.value
            }
        }
    }).then(() => res.status(200).json({message: 'Успешно добавлен комментарий'}))
}
