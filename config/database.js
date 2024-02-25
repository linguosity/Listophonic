require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI

//connect to mongo
mongoose.connect(mongoURI);

//create messages to check mongo connection
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + 'error with mongo connection'))
db.on('connected', () => console.log('mongo is connected'))
db.on('disconnected', () => console.log('mongo disconnected'))