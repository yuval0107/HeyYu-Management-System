'use strict';

const express = require('express');
const { joinWorkspaceController } = require('../controllers/member.controller');

const memberRoutes = express.Router();

memberRoutes.post('/workspace/:inviteCode/join', joinWorkspaceController);

module.exports = memberRoutes;
