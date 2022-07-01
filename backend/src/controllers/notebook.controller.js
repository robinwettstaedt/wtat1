import { Notebook } from '../models/notebook.model';
import { Note } from '../models/note.model';

const userHasAccess = (doc, userID) => {
    const matchingUserID = doc.hasAccess.filter((docUserObj) =>
        docUserObj._id.equals(userID)
    );

    if (matchingUserID.length > 0) {
        return true;
    }
    return false;
};

const getOne = (model) => async (req, res) => {
    try {
        const doc = await model
            .findOne({ _id: req.params.id, hasAccess: req.user._id })
            .select('-__v')
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
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
        const docs = await model
            .find({ hasAccess: req.user._id })
            .select('-__v')
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
            .lean()
            .exec();

        if (!docs) {
            return res.status(404).end();
        }

        return res.status(200).json(docs);
    } catch (e) {
        return res.status(400).end();
    }
};

const createOne = (model) => async (req, res) => {
    try {
        console.log('user', req.user);
        console.log('req.body', req.body);
        const notebook = req.body;

        notebook.hasAccess = [req.user._id];
        notebook.createdBy = req.user._id;

        const createdDoc = await model.create(notebook);

        const doc = await model
            .findById(createdDoc._id)
            .select('-__v')
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
            .lean()
            .exec();

        if (!doc) {
            return res.status(404).end();
        }

        return res.status(201).json(doc);
    } catch (e) {
        console.log(e);
        return res.status(400).end();
    }
};

const updateOne = (model) => async (req, res) => {
    try {
        const notebookUpdates = req.body;

        // updates to the hasAccess fields are handled by different routes
        if (notebookUpdates.hasAccess) {
            delete notebookUpdates.hasAccess;
        }

        // update the document
        const updatedDoc = await model
            .findOneAndUpdate(
                { _id: req.params.id, hasAccess: req.user._id },
                notebookUpdates,
                {
                    new: true,
                }
            )
            .select('-__v')
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
            .exec();

        // check for the cause of the non existent updated document and return correct error status code
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
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
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

const removeFromHasAccess = (model) => async (req, res) => {
    try {
        const doc = await model.findById(req.params.id).lean().exec();

        // only the user that created the notebook can remove somebody from having access to the notebook
        if (!doc.createdBy.equals(req.user._id)) {
            return res.status(403).end();
        }

        if (!userHasAccess(doc, req.body._id)) {
            return res
                .status(400)
                .json({ message: 'User to be removed has no access.' });
        }

        const updatedDoc = await model
            .findOneAndUpdate(
                { _id: req.params.id },
                { $pullAll: { hasAccess: [req.body._id] } },
                {
                    new: true,
                }
            )
            .select('-__v')
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
            .exec();

        if (!updatedDoc) {
            return res.status(404).json({ message: 'Notebook not found' });
        }

        // iterate over the ids of the notes contained in the Notebook doc and update their hasAccess field
        const noteUpdates = [];

        updatedDoc.notes.forEach((noteID) => {
            noteUpdates.push(
                Note.updateOne(
                    { _id: noteID },
                    { $pullAll: { hasAccess: [req.body._id] } }
                )
            );
        });

        await Promise.all(noteUpdates);

        return res.status(200).json(updatedDoc);
    } catch (e) {
        return res.status(400).end();
    }
};

const addToHasAccess = (model) => async (req, res) => {
    try {
        const doc = await model.findById(req.params.id).lean().exec();

        // only the user that created the notebook can add somebody to have access to the notebook
        if (!doc.createdBy.equals(req.user._id)) {
            return res.status(403).end();
        }

        if (userHasAccess(doc, req.body._id)) {
            return res
                .status(400)
                .json({ message: 'User already has access.' });
        }

        const updatedDoc = await model
            .findOneAndUpdate(
                { _id: req.params.id },
                { $push: { hasAccess: [req.body._id] } },
                {
                    new: true,
                }
            )
            .select('-__v')
            .populate('notes', '_id title')
            .populate('hasAccess', '_id username')
            .exec();

        if (!updatedDoc) {
            return res.status(404).json({ message: 'Notebook not found' });
        }

        // iterate over the ids of the notes contained in the Notebook doc and update their hasAccess field
        const noteUpdates = [];

        updatedDoc.notes.forEach((noteID) => {
            noteUpdates.push(
                Note.updateOne(
                    { _id: noteID },
                    { $push: { hasAccess: [req.body._id] } }
                )
            );
        });

        await Promise.all(noteUpdates);

        return res.status(200).json(updatedDoc);
    } catch (e) {
        return res.status(400).end();
    }
};

const crudControllers = (model) => ({
    getOne: getOne(model),
    getMany: getMany(model),
    createOne: createOne(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model),
    removeFromHasAccess: removeFromHasAccess(model),
    addToHasAccess: addToHasAccess(model),
});

export default crudControllers(Notebook);
