import express from 'express';
import noteController from '../controllers/note.controller';

// create the router object
const router = express.Router();

router.route('/').post(noteController.createOne);

router.route('/:id').get(noteController.getOne);

export default router;
