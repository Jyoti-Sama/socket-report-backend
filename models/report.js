const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    name : {
        required: true,
        type: String
    },
    title : {
        required: true,
        type: String
    },
    details : {
        required: true,
        type: String
    },
    images : [String],
    timestamp: { 
        type: Number, 
        default: (new Date()).getTime() 
    } 
})

const ReportModel = mongoose.model('socket-report', ReportSchema)
module.exports = ReportModel;
