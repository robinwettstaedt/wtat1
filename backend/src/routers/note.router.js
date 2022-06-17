import express from 'express';
import noteController from '../controllers/note.controller';

// create the router object
const router = express.Router();

router.route('/').get(noteController.getMany).post(noteController.createOne);

router.route('/:id').get(noteController.getOne);
// .put(noteController.updateOne)
// .delete(noteController.removeOne);

export default router;
