const Complaint = require('../models/Complaint')
const errorHandler = require('../utils/errorHandler')

module.exports.getByEmail = async function (req, res) {
    try {
        const complaintsData = await Complaint.findOne({email: req.params.email});
        res.status(200).json(complaintsData.complaints);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.updateComplaint = async function (req, res) {
    try {
        const complaintCandidate = await Complaint.findOne({email: req.body.email});
        const complaint = await complaintCandidate.updateOne({
            $push: {
                complaints: {
                    complaintDescription: req.body.description
                }
            }
        })
        res.status(201).json(complaint);
    } catch (e) {
        errorHandler(res, e);
    }
}


module.exports.createComplaint = function (req, res) {
    try {
        Complaint.findOne({email: req.body.email}).then(data => {
            if (data) {
                data.updateOne({
                    $push: {
                        complaints: {
                            complaintDescription: req.body.description
                        }
                    }
                }).then(updatedData => res.status(201).json(updatedData))
            } else {
                const complaint = new Complaint({
                    complaints: [
                        {
                            complaintDescription: req.body.description
                        }
                    ],
                    email: req.body.email
                })
                complaint.save().then(data => res.status(201).json(data))
            }
        })
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