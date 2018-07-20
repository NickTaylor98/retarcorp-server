const express = require('express');
const path = require('path');
const pathToHtml = `${__dirname}/../public/html`;
class StaticFilesController {
    constructor(errors) {
        this.errors = errors;
        this.router = express.Router();

        this.handlerHtml = this.handlerHtml.bind(this);
        this.handler = this.handler.bind(this);
        this.handlerLogin = this.handlerLogin.bind(this);
        this.handlerIndex = this.handlerIndex.bind(this);
        this.handlerTasks = this.handlerTasks.bind(this);
        this.handlerTimetables = this.handlerTimetables.bind(this);
        this.handlerReports = this.handlerReports.bind(this);
        this.handlerLogs = this.handlerLogs.bind(this);
        
        this.router.use(this.handlerHtml);
        this.router.get('/login', this.handlerLogin);
        this.router.get('/', this.handlerIndex);
        this.router.get('/timetables', this.handlerTimetables);
        this.router.get('/tasks', this.handlerTasks);
        this.router.get('/reports', this.handlerReports);
        this.router.get('/logs', this.handlerLogs);
    }
    
    handlerHtml(req, res, next) {
        if(req.originalUrl.indexOf('.html') > -1) throw this.errors.notFound;
        next();
    }

    handlerLogin(req, res) {
        if (!req.userId) return res.sendFile(path.resolve(`${pathToHtml}/login.html`));
        else return res.json({redirect : '/'});
    }
    
    handler(req, res, pathFile) {
        if (req.userId) return res.sendFile(path.resolve(`${pathToHtml}/${pathFile}`));
        else return res.json({redirect: '/login'});    
    }

    handlerIndex(req, res) {
        this.handler(req, res, 'index.html');    
    }
    handlerTimetables(req, res) {
        this.handler(req, res, 'timetables.html');        
    }
    handlerReports(req, res) {
        this.handler(req, res, 'reports.html');    
    }
    handlerTasks(req, res) {
        this.handler(req, res, 'tasks.html');             
    }
    handlerLogs(req, res) {
        this.handler(req, res, 'logs.html');        
    }
}
module.exports = (errors) => {
    const staticFilesController = new StaticFilesController(errors);
    return staticFilesController.router;
}