const router = require("express").Router()
const bcrypt = require("bcrypt")
const { Provider } = require("../models/Provider");


/*router.get('/new', (req, res) => {
  res.render('users/new.ejs') //we will make this in another step but good to get the route down
})*/

router.post('/', async (req, res) => {

    try{
        //overwrite the user password with the hashed password, then pass that in to our database
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const newUser = await Provider.create(req.body);
        req.session.currentUser = newUser;
        /*req.session.save((err) => {
            if (err) {
                console.log(err);
            } else {
                return res.redirect('/');
            }
        });
        //console.log(newUser);*/
        res.render('index.ejs', {
            providers: req.session.currentUser,
        })
    }catch(err){
        console.log(err)
    }
})

module.exports = router