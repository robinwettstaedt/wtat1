import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const createAccessToken = (user) =>
    jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        // expiresIn: '15min',
        expiresIn: '1000d',
    });

export const createRefreshToken = (user) =>
    jwt.sign(
        { id: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30d',
        }
    );

export const signin = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .send({ message: 'username and password need to be provided' });
    }

    try {
        const user = await User.findOne({ username: req.body.username }).exec();

        if (!user) {
            return res.status(404).send({
                message: 'User not found',
            });
        }

        const match = await user.checkPassword(req.body.password);

        if (!match) {
            return res.status(401).send({
                message: 'Invalid username and password combination',
            });
        }

        const refreshToken = createRefreshToken(user);

        res.cookie('jid', refreshToken, {
            httpOnly: true,
            path: process.env.HTTP_ONLY_COOKIE_PATH,
            overwrite: true,
        });

        const accessToken = createAccessToken(user);

        return res.status(200).send({ accessToken });
    } catch (e) {
        return res.status(400).end();
    }
};

export const signup = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .send({ message: 'need username and password' });
        }

        const user = await User.create(req.body);

        const refreshToken = createRefreshToken(user);

        res.cookie('jid', refreshToken, {
            httpOnly: true,
            path: process.env.HTTP_ONLY_COOKIE_PATH,
            overwrite: true,
        });

        const accessToken = createAccessToken(user);

        return res.status(201).send({ accessToken });
    } catch (e) {
        return res.status(400).end();
    }
};

// sets the refreshToken cookie to be empty so that the user will not be logged in automatically
export const signout = (req, res) => {
    res.clearCookie('jid', {
        httpOnly: true,
        path: process.env.HTTP_ONLY_COOKIE_PATH,
        overwrite: true,
    });

    return res.status(200).end();
};
// generates and returns a new accessToken to the user by validating their refreshToken
// is requested by the frontend via a timeout function, so that the access token is silently refreshed before it runs out
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.jid;

        if (!refreshToken)
            return res
                .status(401)
                .send({ message: 'no refresh token set in cookie' });

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(payload.id)
            .select('username id tokenVersion')
            .exec();

        if (!user || payload.tokenVersion !== user.tokenVersion) {
            return res.status(401).send({ message: 'invalid auth token' });
        }

        const newAccessToken = createAccessToken(user);

        return res.status(201).send({ accessToken: newAccessToken });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'invalid auth token' });
    }
};

export const checkUsernameAvailability = async (req, res) => {
    const userExists = await User.exists({ username: req.body.username });

    if (userExists) {
        return res.status(400).send({ message: 'username taken' });
    }

    return res.status(200).send({ message: 'valid username' });
};

// middleware securing all routes
// checking each incoming request to /api/... for the Authorization Header
// verifies the JWT inside
// eslint-disable-next-line consistent-return
export const protect = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).end();
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    let payload;

    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (e) {
        return res.status(401).send({ message: 'token verification missed' });
    }

    const user = await User.findById(payload.id)
        .select('-password -tokenVersion -__v')
        .lean()
        .exec();

    if (!user) {
        return res.status(401).end();
    }

    // appends the user object to the request, for use in controllers
    req.user = user;
    next();
};
