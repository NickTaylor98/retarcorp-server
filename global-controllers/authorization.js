'use strict';
const express = require('express');
const {AbilityBuilder,Ability} = require('casl');
class AuthorizationController {
    constructor(userService) {
        this.service = userService;
        this.router = express.Router();

        this.ability = this.ability.bind(this);
        this.router.use('/api', this.ability);

        this.roles = {
            'admin' : this.setAdminPriviliges,
            'helper' : this.setHelperPriviliges,
            'user' : this.setUserPriviliges
        }
    }

    async setAdminPriviliges( userId, can, cannot) {
        can(['create', 'delete'], 'users');
        can('update', 'users', {id : userId});
        
        can('manage', ['tasks', 'timetables']);
        
        can('read', 'logs');
        
        can(['create','read'], 'reports');
        can(['update', 'delete'], 'reports', {userId : userId});
        
     }

    async setHelperPriviliges( userId, can, cannot) {
        can('create', 'users', {Role : 'user'});
        can('update', 'users', {id : userId});
        
        can('manage', 'tasks');
        can('update', 'timetables');
        can(['create','read'], ['reports', 'timetables']);
        can(['update', 'delete'], 'reports', {userId : userId});
     }
    
    async setUserPriviliges(userId, can, cannot) 
    {
        can(['update'], 'users', {id : userId});
        can('read', 'tasks', { users_tasks: { userId : userId}});
        can('read', 'timetables', {userId : userId});

        can(['read', 'update', 'delete'], 'reports', {userId : userId});
        can('create', 'reports');
    }

    async ability(req, res, next) {
        const {rules,can,cannot} = AbilityBuilder.extract();
        const {userId} = req;
        if (!userId) return next(this.service.errors.unauthorized);
        const {Role} = await this.service.read(userId);
        this.roles[Role](parseInt(userId), can, cannot);
        req.ability = new Ability(rules);
        next();
    };
}

module.exports = (userService) => {
    const authorizationController = new AuthorizationController(userService);
    return authorizationController.router;
}