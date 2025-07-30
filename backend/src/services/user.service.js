const User = require("../models/user.model");
const { BadRequestException } = require("../utils/appError");

const getCurrentUserService = async (userId) => {
    const user = await User.findById(userId)
        .populate("currentWorkspace")
        .select("-password");

    if (!user) {
        throw new BadRequestException("User not found");
    }

    return { user };
};

module.exports = {
    getCurrentUserService,
};
