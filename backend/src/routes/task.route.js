'use strict';

const express = require('express');
const {
  createTaskController,
  deleteTaskController,
  updateTaskController,
  getAllTasksController,
  getTaskByIdController
} = require('../controllers/task.controller');

const taskRoutes = express.Router();

taskRoutes.post('/project/:projectId/workspace/:workspaceId/create', createTaskController);
taskRoutes.delete('/:id/workspace/:workspaceId/delete', deleteTaskController);
taskRoutes.put('/:id/project/:projectId/workspace/:workspaceId/update', updateTaskController);
taskRoutes.get('/workspace/:workspaceId/all', getAllTasksController);
taskRoutes.get('/:id/project/:projectId/workspace/:workspaceId', getTaskByIdController);

module.exports = taskRoutes;
