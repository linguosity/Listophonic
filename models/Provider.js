const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    targetSound: {type: String, required: true},
    grade: {type: String, required: true},
    age: {type: Number, required: true},
    realWords: {type: [String], required: true},
    nonsenseWords: {type: [String], required: true},
    maxSyllables: {type: Number, required: true},
    phono: {type: Boolean, required: true},
    phrases: [String],
    sentences: [String],

}, {timestamps: true});

const providerSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    //embedded student schema
    students: [studentSchema]
}, {timestamps: true});

const Student = mongoose.model("Student", studentSchema);
const Provider = mongoose.model("Provider", providerSchema);

module.exports = {Student, Provider};