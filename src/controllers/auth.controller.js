'use strict';

import User from '../models/user';

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

        return res
            .status(201)
            .send({ message: 'User Profile successfully created' });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: e });
    }
};

const signIn = async (req, res) => {
    try {
        // if the email or password is missing in the request body the user can not be created
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: 'need email and password' });
        }

        // search for the user in the database
        const user = await User.findOne({
            email: req.body.username,
            password: req.body.password,
        }).exec();

        // if the user was found
        if (user) {
            console.log(user);
            return res.status(200).send({ message: 'Successfully logged in' });
        }

        return res.status(401).end();
    } catch (e) {
        return res.status(400).end();
    }
};

// combine all controllers onto a single object
const authController = {
    renderSignUp: renderSignUp,
    renderSignIn: renderSignIn,
    signUp: signUp,
    signIn: signIn,
};

export default authController;
