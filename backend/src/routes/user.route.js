'use strict';

const express = require('express');
const { getCurrentUserController } = require('../controllers/user.controller');

const userRoutes = express.Router();

userRoutes.get('/current', getCurrentUserController);

module.exports = userRoutes;
