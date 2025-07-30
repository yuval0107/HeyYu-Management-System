"use strict";

const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
    createTaskSchema,
    updateTaskSchema,
    taskIdSchema
} = require("../validation/task.validation");
const { projectIdSchema } = require("../validation/project.validation");
const { workspaceIdSchema } = require("../validation/workspace.validation");
const { Permissions } = require("../enums/role.enum");
const { getMemberRoleInWorkspace } = require("../services/member.service");
const { roleGuard } = require("../utils/roleGuard");
const {
    createTaskService,
    updateTaskService,
    getAllTasksService,
    getTaskByIdService,
    deleteTaskService
} = require("../services/task.service");
const { HTTPSTATUS } = require("../config/http.config");

// Create Task
const createTaskController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const body = createTaskSchema.parse(req.body);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);

    const { task } = await createTaskService(workspaceId, projectId, userId, body);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task created successfully",
        task,
    });
});

// Update Task
const updateTaskController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const body = updateTaskSchema.parse(req.body);
    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_TASK]);

    const { updatedTask } = await updateTaskService(workspaceId, projectId, taskId, body);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task updated successfully",
        task: updatedTask,
    });
});

// Get All Tasks
const getAllTasksController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const filters = {
        projectId: req.query.projectId,
        status: req.query.status ? req.query.status.split(",") : undefined,
        priority: req.query.priority ? req.query.priority.split(",") : undefined,
        assignedTo: req.query.assignedTo ? req.query.assignedTo.split(",") : undefined,
        keyword: req.query.keyword,
        dueDate: req.query.dueDate,
    };

    const pagination = {
        pageSize: parseInt(req.query.pageSize) || 10,
        pageNumber: parseInt(req.query.pageNumber) || 1,
    };

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const result = await getAllTasksService(workspaceId, filters, pagination);

    return res.status(HTTPSTATUS.OK).json({
        message: "All tasks fetched successfully",
        ...result,
    });
});

// Get Task by ID
const getTaskByIdController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const task = await getTaskByIdService(workspaceId, projectId, taskId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task fetched successfully",
        task,
    });
});

// Delete Task
const deleteTaskController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const taskId = taskIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_TASK]);

    await deleteTaskService(workspaceId, taskId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Task deleted successfully",
    });
});

// Export all controllers
module.exports = {
    createTaskController,
    updateTaskController,
    getAllTasksController,
    getTaskByIdController,
    deleteTaskController
};
