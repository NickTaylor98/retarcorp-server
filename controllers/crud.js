'use strict';
const express = require('express');
const wrap = require('../helpers/wrap');
const {checkAuth} = require('../helpers/authorization');
class CrudController {
    constructor(service) {
        this.service = service;

        this.readAll = this.readAll.bind(this);
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.router = express.Router({
            mergeParams: true
        });
        this.routes = {
            '/': [
                { method: 'get', cb: this.readAll},
                { method: 'post',cb: this.create},
            ],
            '/:id': [
                { method: 'get',  cb: this.read},
                { method: 'put', cb: this.update},
            ]
        };
    }

    async modifyArrayOfObjects(userId, login, objects, type) {
        const id = login ? 
            (await this.service.userService.readByLogin(login)).id :
            userId;
        const oneObject = (type === 'tasks') ? 
            {users_tasks: {userId : id}} : 
            {userId : id};
        oneObject.constructor.modelName = type;
        objects.push(oneObject);
        return objects;
    }

    async checkAuthForObjects(req, objects, type) {
        const {length} = objects;
        const result = await checkAuth(req.ability, 'read', 
            objects.length > 0  ?  objects :
            (await this.modifyArrayOfObjects(req.userId, req.query.login, objects, type)));
        if (!length) objects.pop();
        return result;
    }

    async readAll(req, res) {
        let data = await this.service.readChunk(req.query);
        res.json(data);
    }

    async read(req, res) {
        let data = await this.service.read(req.params.id);
        res.json(data);
    }

    async create(req, res) {
        let data = await this.service.create(req.body);
        res.status(201).json(data);
    }

    async update(req, res) {
        let data = await this.service.update(req.params.id, req.body);
        res.json(data);
    }

    async delete(req, res) {
        let data = await this.service.delete(req.params.id);
        res.json(data);
    }

    registerRoutes() {
        Object.keys(this.routes).forEach(route => {
            let handlers = this.routes[route];
            if (!handlers || !Array.isArray(handlers)) {
                return;
            }
            for (let handler of handlers) {
                this.router[handler.method](
                    route,
                    wrap(handler.cb)
                );
            }
        });
    }
}

module.exports = CrudController;