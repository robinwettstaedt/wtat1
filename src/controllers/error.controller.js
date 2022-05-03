'use strict';

import httpStatus from 'http-status-codes';

const respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.sendFile(`src/public/404.html`, {
        root: './',
    });
};

const respondInternalError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);

    res.sendFile(`src/public/500.html`, {
        root: './',
    });
};

const errorController = {
    respondNoResourceFound: respondNoResourceFound,
    respondInternalError: respondInternalError,
};

export default errorController;
