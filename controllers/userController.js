const router = require("express").Router()
const bcrypt = require("bcrypt")
// Corrected imports using object destructuring based on ChatGPT recommendations [Line 4]
const { Provider } = require("../models/Provider");

router.post('/', async (req, res) => {

    try{
        //overwrite the user password with the hashed password, then pass that in to our database
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const newUser = await Provider.create(req.body);
        req.session.currentUser = newUser;
        
        res.render('index.ejs', {
            providers: req.session.currentUser,
        })
    }catch(err){
        console.log(err)
    }
})

module.exports = router