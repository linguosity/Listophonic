const Provider = require("../models/User");

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
        res.render('index.ejs');
    }
    catch(err) {
        console.log(err);
    }
}


// export route variables for access within external files
module.exports = {
    create,
    new: newForm,
    index,
    /*show,
    seed, 
    destroy,
    edit: editForm,
    update*/
}