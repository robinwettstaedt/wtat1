import express from 'express';
import {
    signout,
    signup,
    signin,
    refreshAccessToken,
} from '../controllers/auth.controller';

// create the router object
const router = express.Router();

router.route('/signup').post(signup);

router.route('/signin').post(signin);

router.route('/signout').post(signout);

router.route('/refreshaccess').post(refreshAccessToken);

export default router;
