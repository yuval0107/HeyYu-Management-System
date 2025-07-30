'use strict';

const mongoose = require('mongoose');
const { generateInviteCode } = require('../utils/uuid');

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model (the workspace creator)
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: generateInviteCode,
    },
  },
  {
    timestamps: true,
  }
);

// Method to reset invite code
workspaceSchema.methods.resetInviteCode = function () {
  this.inviteCode = generateInviteCode();
};

const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);

module.exports = WorkspaceModel;
