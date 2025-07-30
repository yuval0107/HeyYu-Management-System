"use strict";

const { v4: uuidv4 } = require("uuid");

function generateInviteCode() {
    return uuidv4().replace(/-/g, "").substring(0, 8);
}

function generateTaskCode() {
    return `task-${uuidv4().replace(/-/g, "").substring(0, 3)}`;
}

module.exports = {
    generateInviteCode,
    generateTaskCode
};
