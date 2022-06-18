'use strict';
import { Note } from '../models/note.model';

const getOne = (model) => async (req, res) => {
    try {
        // .lean() gets back POJO instead of mongoose object
        // If you're executing a query and sending the results without modification to, say, an Express response, you should use lean.
        // In general, if you do not modify the query results and do not use custom getters, you should use lean()
        const doc = await model
            .findOne({ _id: req.params.id, hasAccess: req.user._id })
            .select('-__v')
            .lean()
            .exec();

        if (!doc) {
            const docWithoutAccess = await model
                .findOne({ _id: req.params.id })
                .lean()
                .exec();

            if (!docWithoutAccess) {
                return res.status(404).end();
            }

            return res.status(403).end();
        }

        return res.status(200).json(doc);
    } catch (e) {
        return res.status(400).end();
    }
};

const getMany = (model) => async (req, res) => {
    try {
        console.log('inside getMany notes');
        if (req.user) {
            // find all notes that have the current user as the value of their hasAccess field
            const notes = await model
                .find({ hasAccess: req.user._id })
                .select('-__v')
                .lean()
                .exec();

            if (!notes) {
                return res.status(404).end();
            }

            return res.status(200).json(notes);
        } else {
            return res.status(401).end();
        }
    } catch (e) {
        console.log(e);
        return res.status(400).end();
    }
};

const createOne = (model) => async (req, res) => {
    try {
        // get the note's data from the request body
        const note = req.body;

        // use the user object to populate the note's fields that require a user id
        note.hasAccess = [req.user._id];
        note.createdBy = req.user._id;
        note.lastUpdatedBy = req.user._id;

        // create the note in the database
        const createdNote = await model.create(note);

        // // updating the notebook entry so that it features this note's id
        // const updatedNotebook = await Notebook.findOneAndUpdate(
        //     { _id: createdNote.notebook, hasAccess: req.user._id },
        //     { $push: { notes: createdNote._id } }
        // ).exec();

        // // update the note's hasAccess to feature everyone in the notebooks hasAccess
        // createdNote.hasAccess = updatedNotebook.hasAccess;

        // // save the created note
        // await createdNote.save();

        const doc = await model
            .findById(createdNote._id)
            .select('-__v')
            .lean()
            .exec();

        if (!doc) {
            return res.status(404).end();
        }

        return res.status(201).json(doc);
    } catch (e) {
        return res.status(400).end();
    }
};

const updateOne = (model) => async (req, res) => {
    try {
        const noteUpdates = req.body;
        noteUpdates.lastUpdatedBy = req.user._id;

        // updates to the hasAccess fields are handled by different routes
        if (noteUpdates.hasAccess) {
            delete noteUpdates.hasAccess;
        }

        // update the document
        const updatedDoc = await model
            .findOneAndUpdate(
                { _id: req.params.id, hasAccess: req.user._id },
                noteUpdates,
                { new: true }
            )
            .select('-__v')
            .exec();

        if (!updatedDoc) {
            const doc = await model.findById(req.params.id).lean().exec();

            if (!doc) {
                return res.status(404).end();
            }

            return res.status(403).end();
        }

        return res.status(200).json(updatedDoc);
    } catch (e) {
        return res.status(400).end();
    }
};

const removeOne = (model) => async (req, res) => {
    try {
        const removed = await model
            .findOneAndRemove({ _id: req.params.id, hasAccess: req.user._id })
            .select('-__v')
            .exec();

        if (!removed) {
            const doc = await model.findById(req.params.id).lean().exec();

            if (!doc) {
                return res.status(404).end();
            }

            return res.status(403).end();
        }

        return res.status(200).json(removed);
    } catch (e) {
        return res.status(400).end();
    }
};

// combine all controllers onto a single object
const noteController = (model) => ({
    getOne: getOne(model),
    getMany: getMany(model),
    createOne: createOne(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model),
});

export default noteController(Note);
