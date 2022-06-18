import User from '../models/user.model';

export const signup = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .send({ message: 'need username and password' });
        }

        // create the user in the database
        const user = await User.create(req.body);

        // use the login function of passportjs to create and set the cookie after the user is created
        req.login(user, (error) => {
            if (error) {
                res.status(500).end();
            }
            return res.status(201).send();
        });
    } catch (e) {
        console.log(e);
        return res.status(400).end();
    }
};

// sets the refreshToken cookie to be empty so that the user will not be logged in automatically
export const signout = (req, res) => {
    req.logout();

    return res.status(200).end();
};

// middleware securing all routes
// eslint-disable-next-line consistent-return
export const protect = async (req, res, next) => {
    console.log('inside protect');
    if (req.user) {
        next();
    } else {
        return res.status(401);
    }
};
