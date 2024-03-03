const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: String,
    targetSound: {type: String, required: true},
    grade: String,
    age: Number,
    realWords: {type: [String], required: true},
    nonsenseWords: [String],
    maxSyllables: {type: Number, required: true},
    phono: String,
    phrases: [String],
    sentences: [String],
    wordPosition: {type: String, required: true}

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