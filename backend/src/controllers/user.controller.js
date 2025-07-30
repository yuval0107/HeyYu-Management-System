"use strict";

const { asyncHandler } = require("../middlewares/asyncHandler.middleware");
const { HTTPSTATUS } = require("../config/http.config");
const { getCurrentUserService } = require("../services/user.service");

// Get current logged-in user controller
const getCurrentUserController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { user } = await getCurrentUserService(userId);
    
    return res.status(HTTPSTATUS.OK).json({
        message: "User fetch successfully",
        user,
    });
});

module.exports = {
    getCurrentUserController
};
