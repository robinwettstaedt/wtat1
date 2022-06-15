'use strict';

const getOne = (req, res) => {
    return res.send(req.params.id);
};

const createOne = (req, res) => {
    return res.send('note created!');
};

// combine all controllers onto a single object
const noteController = {
    getOne: getOne,
    createOne: createOne,
};

export default noteController;
