"use strict";

const { z } = require("zod");
const { TaskPriorityEnum, TaskStatusEnum } = require("../enums/task.enum");

const titleSchema = z.string().trim().min(1).max(255);
const descriptionSchema = z.string().trim().optional();
const assignedToSchema = z.string().trim().min(1).nullable().optional();
const prioritySchema = z.enum(Object.values(TaskPriorityEnum));
const statusSchema = z.enum(Object.values(TaskStatusEnum));
const dueDateSchema = z
    .string()
    .trim()
    .optional()
    .refine((val) => {
        return !val || !isNaN(Date.parse(val));
    }, {
        message: "Invalid date format. Please provide a valid date string.",
    });
const taskIdSchema = z.string().trim().min(1);

const createTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema,
});

const updateTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema,
});

module.exports = {
    titleSchema,
    descriptionSchema,
    assignedToSchema,
    prioritySchema,
    statusSchema,
    dueDateSchema,
    taskIdSchema,
    createTaskSchema,
    updateTaskSchema,
};
