const mongoose = require("mongoose");
const { Roles } = require("../enums/role.enum");
const Member = require("../models/member.model");
const RolePermission = require("../models/roles-permission.model");
const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");
const { NotFoundException, BadRequestException } = require("../utils/appError");
const Task = require("../models/task.model");
const { TaskStatusEnum } = require("../enums/task.enum");
const Project = require("../models/project.model");

// CREATE NEW WORKSPACE
const createWorkspaceService = async (userId, body) => {
    const { name, description } = body;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const ownerRole = await RolePermission.findOne({ name: Roles.OWNER });
    if (!ownerRole) throw new NotFoundException("Owner role not found");

    const workspace = new Workspace({
        name,
        description,
        owner: user._id,
    });
    await workspace.save();

    const member = new Member({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
    });
    await member.save();

    user.currentWorkspace = workspace._id;
    await user.save();

    return { workspace };
};

// GET WORKSPACES USER IS A MEMBER
const getAllWorkspacesUserIsMemberService = async (userId) => {
    const memberships = await Member.find({ userId })
        .populate("workspaceId")
        .select("-password")
        .exec();

    const workspaces = memberships.map(m => m.workspaceId);
    return { workspaces };
};

// GET WORKSPACE BY ID
const getWorkspaceByIdService = async (workspaceId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    const members = await Member.find({ workspaceId }).populate("role");

    return {
        workspace: {
            ...workspace.toObject(),
            members,
        },
    };
};

// GET ALL MEMBERS IN WORKSPACE
const getWorkspaceMembersService = async (workspaceId) => {
    const members = await Member.find({ workspaceId })
        .populate("userId", "name email profilePicture -password")
        .populate("role", "name");

    const roles = await RolePermission.find({}, { name: 1, _id: 1 })
        .select("-permission")
        .lean();

    return { members, roles };
};

// GET WORKSPACE ANALYTICS
const getWorkspaceAnalyticsService = async (workspaceId) => {
    const currentDate = new Date();

    const totalTasks = await Task.countDocuments({ workspace: workspaceId });
    const overdueTasks = await Task.countDocuments({
        workspace: workspaceId,
        dueDate: { $lt: currentDate },
        status: { $ne: TaskStatusEnum.DONE },
    });
    const completedTasks = await Task.countDocuments({
        workspace: workspaceId,
        status: TaskStatusEnum.DONE,
    });

    return {
        analytics: {
            totalTasks,
            overdueTasks,
            completedTasks,
        },
    };
};

// CHANGE MEMBER ROLE
const changeMemberRoleService = async (workspaceId, memberId, roleId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    const role = await RolePermission.findById(roleId);
    if (!role) throw new NotFoundException("Role not found");

    const member = await Member.findOne({ userId: memberId, workspaceId });
    if (!member) throw new Error("Member not found in the workspace");

    member.role = role;
    await member.save();

    return { member };
};

// UPDATE WORKSPACE
const updateWorkspaceByIdService = async (workspaceId, name, description) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;

    await workspace.save();

    return { workspace };
};

// DELETE WORKSPACE
const deleteWorkspaceService = async (workspaceId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const workspace = await Workspace.findById(workspaceId).session(session);
        if (!workspace) throw new NotFoundException("Workspace not found");

        if (!workspace.owner.equals(new mongoose.Types.ObjectId(userId))) {
            throw new BadRequestException("You are not authorized to delete this workspace");
        }

        const user = await User.findById(userId).session(session);
        if (!user) throw new NotFoundException("User not found");

        await Project.deleteMany({ workspace: workspace._id }).session(session);
        await Task.deleteMany({ workspace: workspace._id }).session(session);
        await Member.deleteMany({ workspaceId: workspace._id }).session(session);

        if (user.currentWorkspace?.equals(workspaceId)) {
            const memberWorkspace = await Member.findOne({ userId }).session(session);
            user.currentWorkspace = memberWorkspace ? memberWorkspace.workspaceId : null;
            await user.save({ session });
        }

        await workspace.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        return { currentWorkspace: user.currentWorkspace };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// EXPORTS
module.exports = {
    createWorkspaceService,
    getAllWorkspacesUserIsMemberService,
    getWorkspaceByIdService,
    getWorkspaceMembersService,
    getWorkspaceAnalyticsService,
    changeMemberRoleService,
    updateWorkspaceByIdService,
    deleteWorkspaceService,
};
