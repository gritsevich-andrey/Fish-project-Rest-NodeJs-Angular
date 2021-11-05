const Comments = require('../models/Comments')
const errorHandler = require('../utils/errorHandler')

module.exports.getComments = function (req, res) {
    try {
        Comments.findOne({photoId: req.params.id}).then(data => res.status(200).json(data.comments))
    } catch (e) {
        errorHandler(e)
    }
}

module.exports.createComment = function (req, res) {
    try {
        Comments.findOne({photoId: req.body.photoId})
            .then(data =>
                data.updateOne({
                        $push: {
                            comments: {
                                userEmail: req.body.userEmail,
                                commentValue: req.body.commentValue
                            }
                        }
                    }
                )
            )
            .then(data => res.status(201).json(data))
    } catch (e) {
        errorHandler(e)
    }
}

module.exports.deleteComment = function (req, res) {
    try {
        //Доделать
    } catch (e) {
        errorHandler(e)
    }
}