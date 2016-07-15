//index.js main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); //middlewares
const morgan = require('morgan'); //middleware
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

//app set up
//any incoming request will be passed through the middlewares
//use registers them as middlewares
app.use(morgan('combined')); //logging framework

//specify servers you want to allow
app.use(cors()); //handle cross domain
app.use(bodyParser.json({type: '*/*'})); //any request will be passed as json
router(app);

//server set up
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port);
console.log('server listening on port: ', port);