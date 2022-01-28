const Complaint = require('../models/Complaint')
const errorHandler = require('../utils/errorHandler')

module.exports.getByEmail = function (req, res) {
    Complaint.findOne({email: req.params.email})
        .then(complaintsData => res.status(200).json(complaintsData.complaints))
        .catch(e => errorHandler(res, e))
}

module.exports.createOCR = async function (req, res) {
    console.log('OCR files', req.body);
    res.status(200).json({message: 'OCR received'});
}

module.exports.updateComplaint = function (req, res) {
    Complaint.findOneAndUpdate({email: req.body.email}, {
        $push: {
            complaints: {
                description: req.body.description,
                senderEmail: req.body.senderEmail
            }
        }
    })
        .then((complaint) => res.status(201).json(complaint))
        .catch(e => errorHandler(res, e))
}

module.exports.createComplaint = function (req, res) {
    Complaint.findOneAndUpdate({email: req.body.email}, {
        $push: {
            complaints: {
                description: req.body.description,
                senderEmail: req.body.senderEmail
            }
        }
    }, {upsert: true, setDefaultsOnInsert: true})
        .then(data => res.status(201).json(data))
        .catch(e => errorHandler(res, e))
}

module.exports.deleteByEmail = function (req, res) {
    Complaint.updateOne({email: req.params.email}, {$pull: {'complaints': {_id: req.params.id}}})
        .then(() => res.status(201).json({message: 'Жалоба удалена'}))
        .catch(e => errorHandler(res, e))
}
