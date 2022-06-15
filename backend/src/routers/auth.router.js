import express from 'express';
import authController from '../controllers/auth.controller';

// create the router object
const router = express.Router();

router
    .route('/signup')
    .get(authController.renderSignUp)
    .post(authController.signUp);

router
    .route('/signin')
    .get(authController.renderSignIn)
    .post(authController.signIn);

export default router;
