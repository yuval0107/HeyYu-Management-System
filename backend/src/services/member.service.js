const errorCodeEnum = require("../enums/error-code.enum");
const roleEnum = require("../enums/role.enum");
const Member = require("../models/member.model");
const RolePermission = require("../models/roles-permission.model");
const Workspace = require("../models/workspace.model");
const { NotFoundException, UnauthorizedException, BadRequestException } = require("../utils/appError");

const getMemberRoleInWorkspace = async (userId, workspaceId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const member = await Member.findOne({ userId, workspaceId }).populate("role");
    if (!member) {
        throw new UnauthorizedException("You are not a member of this workspace", errorCodeEnum.ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const roleName = member.role?.name;
    return { role: roleName };
};

const joinWorkspaceByInviteService = async (userId, inviteCode) => {
    const workspace = await Workspace.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new NotFoundException("Invalid invite code or workspace not found");
    }

    const existingMember = await Member.findOne({ userId, workspaceId: workspace._id }).exec();
    if (existingMember) {
        throw new BadRequestException("You are already a member of this workspace");
    }

    const role = await RolePermission.findOne({ name: roleEnum.Roles.MEMBER });
    if (!role) {
        throw new NotFoundException("Role not found");
    }

    const newMember = new Member({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });

    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
};

module.exports = {
    getMemberRoleInWorkspace,
    joinWorkspaceByInviteService,
};
