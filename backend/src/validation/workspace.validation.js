"use strict";

const { z } = require("zod");

const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(255);

const descriptionSchema = z.string().trim().optional();

const workspaceIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Workspace ID is required" });

const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});

const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

const updateWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

module.exports = {
  nameSchema,
  descriptionSchema,
  workspaceIdSchema,
  changeRoleSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
};
