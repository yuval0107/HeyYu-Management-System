"use strict";

const TaskStatusEnum = {
    BACKLOG: "BACKLOG",
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    IN_REVIEW: "IN_REVIEW",
    DONE: "DONE",
};

const TaskPriorityEnum = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    URGENT: "URGENT",
};

module.exports = { TaskStatusEnum, TaskPriorityEnum };
