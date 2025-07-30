"use strict";

const { z } = require("zod");

const emailSchema = z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1)
    .max(255);

const passwordSchema = z.string().trim().min(4);

const registerSchema = z.object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: passwordSchema,
});

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

module.exports = {
    emailSchema,
    passwordSchema,
    registerSchema,
    loginSchema,
};
