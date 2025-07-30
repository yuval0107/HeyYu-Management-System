'use strict';

const express = require('express');
const {
  createWorkspaceController,
  updateWorkspaceByIdController,
  changeWorkspaceMemberRoleController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceMembersController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController
} = require('../controllers/workspace.controller');

const workspaceRoutes = express.Router();

workspaceRoutes.post('/create/new', createWorkspaceController);
workspaceRoutes.put('/update/:id', updateWorkspaceByIdController);
workspaceRoutes.put('/change/member/role/:id', changeWorkspaceMemberRoleController);
workspaceRoutes.delete('/delete/:id', deleteWorkspaceByIdController);
workspaceRoutes.get('/all', getAllWorkspacesUserIsMemberController);
workspaceRoutes.get('/members/:id', getWorkspaceMembersController);
workspaceRoutes.get('/analytics/:id', getWorkspaceAnalyticsController);
workspaceRoutes.get('/:id', getWorkspaceByIdController);

module.exports = workspaceRoutes;
