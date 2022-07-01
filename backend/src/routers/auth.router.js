import express from 'express';
import passport from 'passport';
import { signout, signup } from '../controllers/auth.controller';

// create the router object
const router = express.Router();

router.route('/signup').post(signup);

router.route('/signin').post(passport.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.route('/signout').post(signout);

export default router;
