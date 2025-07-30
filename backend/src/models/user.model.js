'use strict';

const mongoose = require('mongoose');
const { hashValue, compareValue } = require('../utils/bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await hashValue(this.password);
  }
  next();
});

// Method to remove password from returned object
userSchema.methods.omitPassword = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Method to compare password
userSchema.methods.comparePassword = async function (value) {
  return compareValue(value, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
