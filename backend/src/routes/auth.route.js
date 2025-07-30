'use strict';

const express = require('express');
const passport = require('passport');
const { config } = require('../config/app.config');
const {
  registerUserController,
  loginController,
  logOutController,
  googleLoginCallback,
} = require('../controllers/auth.controller');

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = express.Router();

authRoutes.post('/register', registerUserController);
authRoutes.post('/login', loginController);
authRoutes.post('/logout', logOutController);

// Google OAuth Routes
authRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: failedUrl,
  }),
  googleLoginCallback
);

module.exports = authRoutes;
