'use strict';
const express = require('express');
const {
    checkHash
} = require('../helpers/hash');
const AUTH_COOKIE = 'auth_cookie';
class AuthController {
    constructor(userService) {
        this.service = userService;
        this.router = express.Router();
        this.authenticate = this.authenticate.bind(this);
        this.checkAuthorization = this.checkAuthorization.bind(this);
        this.logout = this.logout.bind(this);

        this.router.post('/auth', this.authenticate);
        this.router.post('/logout', this.logout);
        this.router.use('/*', this.checkAuthorization);

        this.cookieOptions = {
            expires: new Date(Date.now() + 9999999),
            httpOnly: false
        };
    }
    async authenticate(req, res, next) {
        const login = req.body.login || req.body.Login;
        const password = req.body.password || req.body.Password;
        const user = await this.service.readByLogin(login, false);
        if (!user) return next(this.service.errors.invalidData);
        const result = await checkHash(password, user.Password);
        if (!result) return next(this.service.errors.invalidData);
        this.setCookieAndSession(req, res, user);
        res.json(user);
    }
    async setCookieAndSession(req, res, user) {
        req.session.userId = user.id;
        res.cookie(AUTH_COOKIE, user.id, this.cookieOptions);
    }

    async logout(req, res, next) {
        res.cookie(AUTH_COOKIE, "", this.cookieOptions);
        req.session.destroy();
        res.send("You is log out");
    }

    async checkAuthorization(req, res, next) {
        if ((req.session === undefined || req.session.userId === undefined) &&
            !req.cookies[AUTH_COOKIE]) return next();
        const userId = req.session.userId || req.cookies[AUTH_COOKIE];
        const user = await this.service.read(userId, false);
        if (!user) return next();
        req.userId = userId;
        next();
    }
}
module.exports = (userService) => {
    const authController = new AuthController(userService);
    return authController.router;
};