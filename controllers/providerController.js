
const Provider = require("../models/Provider").Provider
const Student = require("../models/Provider").Student

//NEW | GET
// render a new form
const newForm = (req,res) => {

};

//CREATE | POST
// manipulate data
const create = async(req, res) => {

};

//INDEX | GET
// render the home page with indexed students
const index = async(req,res) => {
    try{
        const providers = await Provider.find();
        res.render('index.ejs', {providers});
    }
    catch(err) {
        console.log(err);
    }
}

//SHOW

// SEED | GET
// send seed data for display & deletion confirming database access
// Seed function
const seed = async (req, res) => {
    try{
        // add some dummy data into the database
        const provider = await Provider.create(
            [
            {
                firstName: "John",
                lastName: "Doe",
                email: "your_email@example.com",
                students: [
                    {
                        name: "Alice",
                        targetSound: "k",
                        grade: "Kindergarten",
                        age: 5,
                        realWords: ["cat", "kite", "key"],
                        nonsenseWords: ["kip", "kop", "kak"],
                        maxSyllables: 2,
                        phono: true,
                    },
                    {
                        name: "Bob",
                        targetSound: "m",
                        grade: "1st Grade",
                        age: 6,
                        realWords: ["map", "milk", "man"],
                        nonsenseWords: ["mip", "mop", "mam"],
                        maxSyllables: 3,
                        phono: true,
                    },
                    {
                        name: "Charlie",
                        targetSound: "f",
                        grade: "2nd Grade",
                        age: 7,
                        realWords: ["fish", "face", "fun"],
                        nonsenseWords: ["fop", "fip", "faf"],
                        maxSyllables: 4,
                        phono: true,
                    },
                    {
                        name: "Diana",
                        targetSound: "s",
                        grade: "3rd Grade",
                        age: 8,
                        realWords: ["sun", "sock", "sit"],
                        nonsenseWords: ["sip", "sop", "sas"],
                        maxSyllables: 5,
                        phono: true,
                    },
                    {
                        name: "Emily",
                        targetSound: "th",
                        grade: "4th Grade",
                        age: 9,
                        realWords: ["thin", "think", "three"],
                        nonsenseWords: ["thip", "thop", "thap"],
                        maxSyllables: 6,
                        phono: true,
                    },
                ],
            }])
        
        //after creating see data redirect to home
        res.redirect('/main')
        console.log(provider);

    }catch(err){
        console.log(err)
    }
}

// export route variables for access within external files
module.exports = {
    create,
    new: newForm,
    index,
    //show,
    seed, 
    //destroy,
    //edit: editForm,
    //update*/
}