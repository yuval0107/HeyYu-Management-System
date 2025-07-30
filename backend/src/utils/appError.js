"use strict";

const { HTTPSTATUS } = require("../config/http.config");
const { ErrorCodeEnum } = require("../enums/error-code.enum");

class AppError extends Error {
    constructor(message, statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class HttpException extends AppError {
    constructor(message = "Http Exception Error", statusCode, errorCode) {
        super(message, statusCode, errorCode);
    }
}

class InternalServerException extends AppError {
    constructor(message = "Internal Server Error", errorCode) {
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }
}

class NotFoundException extends AppError {
    constructor(message = "Resource not found", errorCode) {
        super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }
}

class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode) {
        super(message, HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCodeEnum.VALIDATION_ERROR);
    }
}

class UnauthorizedException extends AppError {
    constructor(message = "Unauthorized Access", errorCode) {
        super(message, HTTPSTATUS.UNAUTHORIZED, errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
}

module.exports = {
    AppError,
    HttpException,
    InternalServerException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException
};
