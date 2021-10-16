const Complaint = require('../models/Complaint')
const errorHandler = require('../utils/errorHandler')

module.exports.getByEmail = async function (req, res) {
    try {
        const complaints = await Complaint.find({email: req.params.email});
        res.status(200).json(complaints[0].description);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.createComplaint = async function (req, res) {
    try {
        const complaintCandidate = await Complaint.findOne({email: req.body.email});
        if (!complaintCandidate) {
            const complaint = new Complaint({
                description: req.body.description,
                email: req.body.email
            })
            await complaint.save();
            res.status(201).json(complaint);
        } else {
            const complaint = await complaintCandidate.updateOne({$push: {description: req.body.description}})
            res.status(201).json(complaint);
        }
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.deleteByEmail = async function (req, res) {
    try {
        //нужно чтото решить с моделью жалоб
    } catch (e) {
        errorHandler(res, e);
    }
}