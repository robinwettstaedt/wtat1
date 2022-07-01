'use strict';

import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import local from './strategies/local';

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

// cors
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
    })
);

// enable session support
const store = new session.MemoryStore();

app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET,
        cookie: {
            httpOnly: true,
            path: process.env.HTTP_ONLY_COOKIE_PATH,
            overwrite: true,
        },
        saveUninitialized: true,
        resave: true,
        store,
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

// initialize passportjs authentication
app.use(passport.initialize());
app.use(passport.session());

// require a signed in user for all requests
// app.use('/api', protect);

// routes
app.use('/auth', authRouter);

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
