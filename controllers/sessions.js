const bcrypt = require('bcrypt')
const router = require('express').Router()
const { Provider } = require('../models/Provider.js')


// on sessions form submit (log in)
router.post('/', async (req, res) => {
  // username is found and password matches
  // successful log in

  // username is not found - who cares about password if you don't have a username that is found?
  // unsuccessful login

  // username found but password doesn't match
  // unsuccessful login

  // some weird thing happened???????

  // Step 1 Look for the username
  try {
    const foundUser = await Provider.findOne({ username: req.body.username })
    if (!foundUser) {
        // if found user is undefined/null not found etc
        res.send('<a  href="/">Sorry, no user found </a>')
    
    } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // user is found yay!
        // yay passwords match!
        // add the user to our session
        req.session.currentUser = foundUser
        // redirect back to our home page
        res.redirect('/')
    } else {
        // passwords do not match
        res.send('<a href="/"> password does not match </a>')
    }
  } catch(err) {
    //DB error
    console.log(err)
    res.send('oops the db had a problem')
  }
})

router.delete('/', (req, res) => {
  req.session.destroy(() => {
    console.log("delete");
    res.redirect('/')
  })
})

module.exports = router
