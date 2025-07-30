"use strict";

const { z } = require("zod");

const emojiSchema = z.string().trim().optional();
const nameSchema = z.string().trim().min(1).max(255);
const descriptionSchema = z.string().trim().optional();
const projectIdSchema = z.string().trim().min(1);

const createProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema,
});

const updateProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema,
});

module.exports = {
    emojiSchema,
    nameSchema,
    descriptionSchema,
    projectIdSchema,
    createProjectSchema,
    updateProjectSchema,
};
