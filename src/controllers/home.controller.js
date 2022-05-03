'use strict';

const getMany = (req, res) => {
    res.send('Hello and Welcome!');
};

const getOne = (req, res) => {
    const name = req.params.name;
    res.render('index', { name: name });
};

// combine all controllers onto a single object
const homeController = {
    getMany: getMany,
    getOne: getOne,
};

export default homeController;
