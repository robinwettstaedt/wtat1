import express from 'express';
import notebookController from '../controllers/notebook.controller';

// create the router object
const router = express.Router();

router
    .route('/')
    .get(notebookController.getMany)
    .post(notebookController.createOne);

router
    .route('/:id')
    .get(notebookController.getOne)
    .put(notebookController.updateOne)
    .delete(notebookController.removeOne);

export default router;
