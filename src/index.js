'use strict';

import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import layouts from 'express-ejs-layouts';

// local imports
import errorController from './controllers/error.controller';
import noteRouter from './routers/note.router';
import homeRouter from './routers/home.router';
import authRouter from './routers/auth.router';

// initalize dotenv to be able to use hidden environment variables
dotenv.config();

const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');

// connect to mongodb
const dbURI = 'mongodb+srv://user1:strawberryOnline@cluster0.fx1ve.mongodb.net/Node1?retryWrites=true&w=majority';
mongoose.connect(dbURI) //, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(process.env.PORT, () => {
                    console.log(`REST API on http://localhost:${app.get('port')}`);
                    }))
  .catch((err) => console.log(err));

// disabling the express startup message (not necessary but saves log space in a production app)
app.disable('x-powered-by');

// this is because of 304 status code / express just sending cached data
app.disable('etag');

// convert incoming json data into a JS object
app.use(express.json());

// tell express to parse url-encoded data
app.use(express.urlencoded({ extended: false }));

// package for logging incoming requests
app.use(morgan('dev'));

// use express-ejs-layouts for layout templating
app.use(layouts);

// allow express to serve static files
app.use(express.static('src/public'));

// mongoose and mono sandbox routers (just for testing reasons)
app.get('/add-user', (req, res) => {
  const user = new User({
    username: 'user0',
    password: 'user0password'
  });

  user.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/all-users', (req, res) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
})

// set the port variable in express
app.set('port', process.env.PORT);

// tell express to use the ejs library to render the views
app.set('view engine', 'ejs');

// tell express to change the default location of the view files
app.set('views', 'src/views');

// routes
app.use('/', homeRouter);

app.use('/note', noteRouter);

app.use('/auth', authRouter);

// app.use('*', (req, res) => res.status(404).json({ error: 'invalid route' }));

// error logging middleware
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

// have the app listen on the specified port
//app.listen(process.env.PORT, () => {
//    console.log(`REST API on http://localhost:${app.get('port')}`);
//});
