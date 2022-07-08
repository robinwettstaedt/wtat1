'use strict';

import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// local imports
import connectToMongoDB from './connection/connectToMongoDB';
import noteRouter from './routers/note.router';
import notebookRouter from './routers/notebook.router';
import authRouter from './routers/auth.router';
import { protect } from './controllers/auth.controller';

// initalize dotenv to be able to use hidden environment variables
dotenv.config();

// get the app object from express
const app = express();

// let the app use cookies
app.use(cookieParser());

// cors
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
    })
);

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

// set the port variable in express
app.set('port', process.env.PORT);

// routes
app.use('/auth', authRouter);

// require a signed in user for all requests
app.use('/api', protect);

app.use('/api/note', noteRouter);

app.use('/api/notebook', notebookRouter);

app.use('*', (req, res) => res.status(404).json({ error: 'invalid route' }));

// connect to the database and have the app listen on the specified port
try {
    connectToMongoDB();

    app.listen(process.env.PORT, () => {
        console.log(`REST API on http://localhost:${app.get('port')}`);
    });
} catch (e) {
    console.error(e);
}
