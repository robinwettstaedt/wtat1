'use strict';

import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import layouts from 'express-ejs-layouts';

// local imports
import connectToMongoDB from './connection/connectToMongoDB';
import errorController from './controllers/error.controller';
import noteRouter from './routers/note.router';
import homeRouter from './routers/home.router';
import authRouter from './routers/auth.router';
import { protect } from './controllers/auth.controller';

// initalize dotenv to be able to use hidden environment variables
dotenv.config();

// get the app object from express
const app = express();

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

// set the port variable in express
app.set('port', process.env.PORT);

// tell express to use the ejs library to render the views
app.set('view engine', 'ejs');

// tell express to change the default location of the view files
app.set('views', 'src/views');

// routes
app.use('/', homeRouter);

app.use('/auth', authRouter);

app.use('/', protect);

app.use('/note', noteRouter);

// error logging middleware
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

// connect to the database and have the app listen on the specified port
try {
    connectToMongoDB();

    app.listen(process.env.PORT, () => {
        console.log(`REST API on http://localhost:${app.get('port')}`);
    });
} catch (e) {
    console.error(e);
}
