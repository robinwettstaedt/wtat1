'use strict';

import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { getNoteById } from './controllers/note.controller';
import { sendWelcomeMessage } from './controllers/home.controller';

// initalize dotenv to be able to use hidden environment variables
dotenv.config();

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

// routes
app.get('/', sendWelcomeMessage);
app.get('/note/:id', getNoteById);
app.use('*', (req, res) => res.status(404).json({ error: 'invalid route' }));

// have the app listen on the specified port
app.listen(process.env.PORT, () => {
    console.log(`REST API on http://localhost:${process.env.PORT}`);
});
