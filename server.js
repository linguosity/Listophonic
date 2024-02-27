require("dotenv").config();
const express = require('express');
const app = express();
require("./config/database");
const methodOverride = require('method-override');
const session = require("express-session");
const https = require("https");

//set port variable
const port = 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

app.get('/openai', (req, res) => {
    const data = JSON.stringify({
        model: "gpt-3.5-turbo-1106", // Update the model to the one you intend to use
        response_format: { "type": "json_object" },
        messages: [
            { role: "system", content: `
            You are an expert linguist with tremendous semantic and grammatical knowledge. Given a list of real or nonsense target words, you can create a variety of (1) noun, verb or prepositional phrases and (2) complete simple sentences with these target words embedded. Return responses in JSON format. 
            ` },
            { role: "user", content: `
                realWords: ["cat", "kite", "key"],
                nonsenseWords: ["kip", "kop", "kak"]
            ` }
            // Add more messages as needed
        ]
    });

    const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const apiRequest = https.request(options, apiResponse => {
        let data = '';

        apiResponse.on('data', chunk => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            res.json(JSON.parse(data));
        });
    });

    apiRequest.on('error', error => {
        res.status(500).send(error.toString());
    });

    apiRequest.write(data);
    apiRequest.end();
});
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