"use strict";

require("dotenv/config");
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const { config } = require("./config/app.config");
const connectDatabase = require("./config/database.config");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const { HTTPSTATUS } = require("./config/http.config");
const { asyncHandler } = require("./middlewares/asyncHandler.middleware");
const { BadRequestException } = require("./utils/appError");
const { ErrorCodeEnum } = require("./enums/error-code.enum");
require("./config/passport.config");
const passport = require("passport");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const isAuthenticated = require("./middlewares/isAuthenticated.middleware");
const workspaceRoutes = require("./routes/workspace.route");
const memberRoutes = require("./routes/member.route");
const projectRoutes = require("./routes/project.route");
const taskRoutes = require("./routes/task.route");

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  "/",
  asyncHandler(async (req, res, next) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    // This code won't be reached because of the thrown error
    // return res.status(HTTPSTATUS.OK).json({
    //   message: "Ok working",
    // });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
