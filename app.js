const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require('dotenv/config');

//import routes
const postRoute = require('./routes/posts');
const bookRoute = require('./routes/books');

//middlewares
app.use(bodyParser.json());
app.use('/posts', postRoute);
app.use('/books', bookRoute);
app.get('/', (req, res)=>{
    res.send("casa dolce casa");
});
//connessione al db

mongoose.connect(process.env.DB_CONNESSIONE)
.then(console.log("connesso a mongo Atlas"))
.catch(err => console.log(err))

app.listen(3000);