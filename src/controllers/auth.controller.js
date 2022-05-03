'use strict';

const renderSignUp = (req, res) => {
    res.render('auth/signup');
};

const renderSignIn = (req, res) => {
    res.render('auth/signin');
};

const signUp = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    res.send(
        `You have signed up! 

		username: ${username}
		password: ************

		**Not really because we don't have a database yet`
    );
};

const signIn = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    res.send(
        `You have signed in! 

		username: ${username}
		password: ************

		**Not really because we don't have a database yet`
    );
};

// combine all controllers onto a single object
const authController = {
    renderSignUp: renderSignUp,
    renderSignIn: renderSignIn,
    signUp: signUp,
    signIn: signIn,
};

export default authController;
