import express from 'express';
import homeController from '../controllers/home.controller';

// create the router object
const router = express.Router();

router.route('/').get(homeController.getMany);

router.route('/name/:name').get(homeController.getOne);

export default router;
