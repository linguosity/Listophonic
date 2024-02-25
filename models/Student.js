const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {Type: String, required: true},
    targetSound: {Type: String, required: true},
    grade: {Type: String, required: true},
    age: {Type: Number, required: true},
    realWords: {Type: [String], required: true},
    nonsenseWords: {Type: [String], required: true},
    maxSyllables: {Type: Number, required: true},
    phono: {Type: Boolean, required: true}

}, {timeStamps: true});

const providerSchema = new mongoose.Schema({
    firstName: {Type: String, required: true},
    lastName: {Type: String, required: true},
    email: {Type: Email, required: true},
    //embedded student schema
    students: [studentSchema]
}, {timeStamps: true});

const Student = mongoose.model("Student", studentSchema);
const Provider = mongoose.model("Provider", providerSchema);

module.exports = {Student, Provider};