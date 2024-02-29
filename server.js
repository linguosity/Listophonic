require("dotenv").config();
const express = require('express');
const app = express();
require("./config/database");
const methodOverride = require('method-override');
const session = require("express-session");


//set port variable
const port = process.env.PORT;

/*Import provider routes*/
const providerRoutes = require("./routes/providerRoutes");
const userController = require("./controllers/userController");
const sessionsController = require("./controllers/sessions");

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    resave: false, //don't save upon read(?)
    saveUninitialized: false, //don't save cookie w/o user's permission
}))

////////////

//include routes files as middleware
app.use("/main", providerRoutes);
//app.use("/users", userController);
//app.use("/sessions", sessionsController);

//redirect user from root to '/main'
app.get("/", (req, res) => {
    res.redirect('/main');
})

app.listen(port, ()=> {
    console.log(`Express is listening on port: ${port}`);
});