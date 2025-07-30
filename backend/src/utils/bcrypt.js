"use strict";

const bcrypt = require("bcrypt");

const hashValue = async (value, saltRounds = 10) => {
    return await bcrypt.hash(value, saltRounds);
};

const compareValue = async (value, hashedValue) => {
    return await bcrypt.compare(value, hashedValue);
};

module.exports = {
    hashValue,
    compareValue
};
