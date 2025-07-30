"use strict";

const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const { createProjectSchema, updateProjectSchema, projectIdSchema } = require("../validation/project.validation");
const { workspaceIdSchema } = require("../validation/workspace.validation");
const { getMemberRoleInWorkspace } = require("../services/member.service");
const { roleGuard } = require("../utils/roleGuard");
const { Permissions } = require("../enums/role.enum");
const {
    createProjectService,
    getProjectsInWorkspaceService,
    getProjectByIdAndWorkspaceIdService,
    getProjectAnalyticsService,
    updateProjectService,
    deleteProjectService
} = require("../services/project.service");
const { HTTPSTATUS } = require("../config/http.config");

// Create project controller
const createProjectController = asyncHandler(async (req, res) => {
    const body = createProjectSchema.parse(req.body);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_PROJECT]);

    const { project } = await createProjectService(userId, workspaceId, body);
    return res.status(HTTPSTATUS.CREATED).json({
        message: "Project created successfully",
        project,
    });
});

// Get all projects in workspace
const getAllProjectsInWorkspaceController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const { projects, totalCount, totalPages, skip } = await getProjectsInWorkspaceService(
        workspaceId,
        pageSize,
        pageNumber
    );

    return res.status(HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        projects,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: pageSize,
        },
    });
});

// Get project by ID and workspace ID
const getProjectByIdAndWorkspaceIdController = asyncHandler(async (req, res) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { project } = await getProjectByIdAndWorkspaceIdService(workspaceId, projectId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project fetched successfully",
        project,
    });
});

// Get project analytics
const getProjectAnalyticsController = asyncHandler(async (req, res) => {
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getProjectAnalyticsService(workspaceId, projectId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project analytics retrieved successfully",
        analytics,
    });
});

// Update project
const updateProjectController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const body = updateProjectSchema.parse(req.body);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_PROJECT]);

    const { project } = await updateProjectService(workspaceId, projectId, body);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project updated successfully",
        project,
    });
});

// Delete project
const deleteProjectController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const projectId = projectIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_PROJECT]);

    await deleteProjectService(workspaceId, projectId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Project deleted successfully",
    });
});

// Export all controllers
module.exports = {
    createProjectController,
    getAllProjectsInWorkspaceController,
    getProjectByIdAndWorkspaceIdController,
    getProjectAnalyticsController,
    updateProjectController,
    deleteProjectController
};
