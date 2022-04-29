'use strict';

export const getNoteById = (req, res) => {
    return res.send(req.params.id);
};
