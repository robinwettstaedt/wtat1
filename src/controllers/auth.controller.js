'use strict';

import User from '../models/user.model';

export const createAccessToken = (user) =>
    jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        // expiresIn: '15min',
        expiresIn: '1000d',
    });

const renderSignUp = (req, res) => {
    res.render('auth/signup');
};

const renderSignIn = (req, res) => {
    res.render('auth/signin');
};

const signUp = async (req, res) => {
    try {
        // if the email or password is missing in the request body the user can not be created
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: 'need email and password' });
        }

        // create the user
        const user = await User.create(req.body);

        // if the user was successfully created
        if (user) {
            // send a route to redirect to based on the user's username
            return res.status(201).send({
                message: `/name/${user.username}`,
            });
        }

        // if the user was not created but there was no error thrown
        return res.status(500).end();
    } catch (e) {
        console.log(e);
        return res.status(400).end();
    }
};

const signIn = async (req, res) => {
    // if the email or password is missing in the request body the user does not yet have an account
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({ message: 'need email and password' });
    }

    try {
        // search for the user in the database
        const user = await User.findOne({
            username: req.body.username,
        }).exec();

        if (!user) {
            return res.status(404).send({
                message: 'User not found',
            });
        }

        const match = await user.checkPassword(req.body.password);

        if (!match) {
            return res.status(401).send({
                message: 'Invalid email and password combination',
            });
        }

        // user was found and password entered is correct:
        // send a route to redirect to based on the user's username
        return res.status(200).send({
            message: `/name/${user.username}`,
        });
    } catch (e) {
        console.log(e);
        return res.status(400).end();
    }
};

// middleware securing all routes
// checking each incoming request for the Authorization Header
// verifies the JWT inside
// eslint-disable-next-line consistent-return
export const protect = async (req, res, next) => {
    const bearer = req.headers.authorization;

    // if no accessToken is present on the request: redirect to the signin page
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.render('auth/signin');
    }

    // remove the Bearer beginning part of the token
    const accessToken = bearer.split('Bearer ')[1].trim();

    let payload;

    // verify the jwt received by the request
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
        // if the verification is not successful: redirect to the signin page
        return res.render('auth/signin');
    }

    const user = await User.findById(payload.id)
        .select('-password -__v')
        .lean()
        .exec();

    if (!user) {
        // if the user was not found: redirect to the signin page
        return res.render('auth/signin');
    }

    // append the user object to the request, for use in other controllers
    req.user = user;

    next();
};

// combine all controllers onto a single object
const authController = {
    renderSignUp: renderSignUp,
    renderSignIn: renderSignIn,
    signUp: signUp,
    signIn: signIn,
    protect: protect,
};

export default authController;
