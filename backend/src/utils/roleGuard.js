"use strict";

const { UnauthorizedException } = require("./appError");
const { RolePermissions } = require("./role-permission");

const roleGuard = (role, requiredPermissions) => {
    const permissions = RolePermissions[role];
    // If the role doesn't exist or lacks required permissions, throw an exception
    const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));
    if (!hasPermission) {
        throw new UnauthorizedException("You do not have the necessary permissions to perform this action");
    }
};

module.exports = { roleGuard };
