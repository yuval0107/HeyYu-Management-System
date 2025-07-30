"use strict";

const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const {
    createWorkspaceSchema,
    workspaceIdSchema,
    changeRoleSchema,
    updateWorkspaceSchema
} = require("../validation/workspace.validation");
const { HTTPSTATUS } = require("../config/http.config");
const {
    createWorkspaceService,
    getAllWorkspacesUserIsMemberService,
    getWorkspaceByIdService,
    getWorkspaceMembersService,
    getWorkspaceAnalyticsService,
    changeMemberRoleService,
    updateWorkspaceByIdService,
    deleteWorkspaceService
} = require("../services/workspace.service");
const { getMemberRoleInWorkspace } = require("../services/member.service");
const { Permissions } = require("../enums/role.enum");
const { roleGuard } = require("../utils/roleGuard");

// Create workspace
const createWorkspaceController = asyncHandler(async (req, res) => {
    const body = createWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;

    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace,
    });
});

// Get all workspaces for user
const getAllWorkspacesUserIsMemberController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId);

    return res.status(HTTPSTATUS.OK).json({
        message: "User workspaces fetched successfully",
        workspaces,
    });
});

// Get workspace by ID
const getWorkspaceByIdController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);
    const { workspace } = await getWorkspaceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        workspace,
    });
});

// Get members of a workspace
const getWorkspaceMembersController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace members retrieved successfully",
        members,
        roles,
    });
});

// Get workspace analytics
const getWorkspaceAnalyticsController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace analytics retrieved successfully",
        analytics,
    });
});

// Change member role
const changeWorkspaceMemberRoleController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(workspaceId, memberId, roleId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Member Role changed successfully",
        member,
    });
});

// Update workspace
const updateWorkspaceByIdController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(workspaceId, name, description);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace,
    });
});

// Delete workspace
const deleteWorkspaceByIdController = asyncHandler(async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(workspaceId, userId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace,
    });
});

// Export controllers
module.exports = {
    createWorkspaceController,
    getAllWorkspacesUserIsMemberController,
    getWorkspaceByIdController,
    getWorkspaceMembersController,
    getWorkspaceAnalyticsController,
    changeWorkspaceMemberRoleController,
    updateWorkspaceByIdController,
    deleteWorkspaceByIdController
};
