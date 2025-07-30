'use strict';

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const Workspace = require('../models/workspace.model');
const RolePermission = require('../models/roles-permission.model');
const { Roles } = require('../enums/role.enum');
const {
  NotFoundException,
  UnauthorizedException,
  BadRequestException
} = require('../utils/appError');
const Member = require('../models/member.model');
const { ProviderEnum } = require('../enums/account-provider.enum');

const loginOrCreateAccountService = async (data) => {
  const { providerId, provider, displayName, email, picture } = data;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("Started Session...");
    let user = await User.findOne({ email }).session(session);

    if (!user) {
      user = new User({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new Account({
        userId: user._id,
        provider,
        providerId,
      });
      await account.save({ session });

      const workspace = new Workspace({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RolePermission.findOne({ name: Roles.OWNER }).session(session);
      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new Member({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id;
      await user.save({ session });
    }

    await session.commitTransaction();
    console.log("End Session...");
    return { user };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const registerUserService = async (body) => {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = new User({ email, name, password });
    await user.save({ session });

    const account = new Account({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    const workspace = new Workspace({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const ownerRole = await RolePermission.findOne({ name: Roles.OWNER }).session(session);
    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    const member = new Member({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id;
    await user.save({ session });

    await session.commitTransaction();
    console.log("End Session...");
    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const verifyUserService = async ({ email, password, provider = ProviderEnum.EMAIL }) => {
  const account = await Account.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await User.findById(account.userId);
  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user.omitPassword();
};

module.exports = {
  loginOrCreateAccountService,
  registerUserService,
  verifyUserService
};
