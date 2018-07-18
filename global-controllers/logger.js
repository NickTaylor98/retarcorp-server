'use strict';
const express = require('express');
const {
    checkAuth
} = require('../helpers/authorization');

class LogController {
    constructor(logService, errors) {
        this.service = logService;
        this.log = this.log.bind(this);
        this.readAll = this.readAll.bind(this);
    }
    async log(req, res, next) {
        const data = {
            URL: req.originalUrl,
            Method: req.method,
            Body: JSON.stringify(req.body),
            Date: new Date(),
            IP: req.ip
        }
        const item = await this.service.create(data);
        next();
    }

    async readAll(req, res, next) {
        const result = await checkAuth(req.ability, 'read', 'logs');
        if (!result) return next(this.service.errors.unauthorized);
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const data = await this.service.readAll([limit, offset]);
        res.json(data);
    }
}
module.exports = (logService) => {
    const logController = new LogController(logService);

    return {
        log: logController.log,
        readLogs: logController.readAll
    };
};