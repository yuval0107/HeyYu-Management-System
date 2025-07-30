'use strict';

const { UnauthorizedException } = require('../utils/appError');

const isAuthenticated = (req, res, next) => {
    if (!req.user || !req.user._id) {
        throw new UnauthorizedException('Unauthorized. Please log in.');
    }
    next();
};

module.exports = isAuthenticated;
