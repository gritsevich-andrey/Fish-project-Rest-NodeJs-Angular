const Complaint = require('../models/Complaint')
const errorHandler = require('../utils/errorHandler')

module.exports.getAllById = async function (req, res) {
    try {
        const complaints = await Complaint.find({userId: req.params.id});
        res.status(200).json(complaints);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.createComplaint = async function (req, res) {
    try {
        const complaintCandidate = await Complaint.findOne({userId: req.body.id});
        if(!complaintCandidate) {
            const complaint = new Complaint({
                description: req.body.description,
                userId: req.body.id
            })
            await complaint.save();
            res.status(201).json(complaint);
        } else {
            //Доделать добавление жалоб
        }
    } catch (e) {
        errorHandler(res, e);
    }
}