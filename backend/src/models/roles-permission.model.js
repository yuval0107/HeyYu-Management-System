'use strict';

const mongoose = require('mongoose');
const { Roles, Permissions } = require('../enums/role.enum');
const { RolePermissions } = require('../utils/role-permission');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function () {
        return RolePermissions[this.name];
      },
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel;
