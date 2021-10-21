const Complaint = require('../models/Complaint')
const errorHandler = require('../utils/errorHandler')
const {v4} = require("uuid");

module.exports.getByEmail = async function (req, res) {
    try {
        const complaintsData = await Complaint.findOne({email: req.params.email});
        res.status(200).json(complaintsData.complaints);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.createComplaint = async function (req, res) {
    try {
        const newComplaint = {
            complaintId: v4(),
            complaintDescription: req.body.description
        }
        const complaint = new Complaint({
            complaints: [newComplaint],
            email: req.body.email
        })
        await complaint.save();
        res.status(201).json(complaint);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.updateComplaint = async function (req, res) {
    try {
        const complaintCandidate = await Complaint.findOne({email: req.body.email});
        const newComplaint = {
            complaintId: v4(),
            complaintDescription: req.body.description
        }
        const complaint = await complaintCandidate.updateOne({$push: {complaints: newComplaint}})
        res.status(201).json(complaint);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.deleteByEmail = async function (req, res) {
    try {
        const complaints = await Complaint.updateOne({email: req.params.email}, {$pull: {'complaints': {complaintId: req.params.id}}});
        res.status(201).json({message: 'Жалоба удалена'});
    } catch (e) {
        errorHandler(res, e);
    }
}