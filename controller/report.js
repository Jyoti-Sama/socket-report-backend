const mongoose = require('mongoose');
const ReportModel = require('../models/report');


const createReport = async(name, details, title, images) => {
    const newReport = new ReportModel({name, details, title, images});
    try {
        const response = await newReport.save();
        return response;
    } catch (error) {
        console.log(error);
        
        const err = new Error(err.message);
        throw err;
    }
}

const getAllReport = async() => {

    try {
        const response = await ReportModel.find();
        return response;
    } catch (error) {
        console.log(error);
        
        const err = new Error(err.message);
        throw err;
    }
}

const editReport = async (_id, name, details, title) => {

    try {
        const oldReport = await ReportModel.findById(_id);

        oldReport.name = name;
        oldReport.details = details;
        oldReport.title = title;

        const response = await oldReport.save();

        return response;
    } catch (error) {
        console.log(error);

        const err = new Error(err.message);
        throw err;
    }
}

const deleteReport = async (_id) => {
    try {
        const response = await ReportModel.findByIdAndDelete(_id)

        return response;
    } catch (error) {
        console.log(error);

        const err = new Error(err.message);
        throw err;
    }
}

module.exports = {
    createReport,
    getAllReport,
    editReport,
    deleteReport
}