'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid/v4');


const errors = require('./helpers/errors');
//services

const UserService = require('./services/users');
const ReportService = require('./services/reports');
const TimeTableService = require('./services/timetables');
const TaskService = require('./services/tasks');
const LogService = require('./services/logs');
module.exports = (db) => {
    const app = express();
    //services

    const userService = new UserService(
        db.users,
        errors
    );
    const reportService = new ReportService(
        db.reports,
        userService,
        errors
    );

    const timetableService = new TimeTableService(
        db.timetables,
        userService,
        errors
    );
    const taskService = new TaskService(
        db.tasks,
        userService,
        errors
    );
    const logService = new LogService(db.logs, errors);

    //controllers
    const staticFilesController = require('./global-controllers/static-files')(errors);
    const {log, readLogs} = require('./global-controllers/logger')(logService);
    const apiController = require('./controllers/api')(userService, reportService, taskService, timetableService, readLogs);
    const authenticationController = require('./global-controllers/authentication')(userService);
    const authorizationController = require('./global-controllers/authorization')(userService);
    const errorController = require('./global-controllers/errors');
    //Mounting


    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') return res.send();
        next();
    });
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(session({
        genid: (req) => uuid(),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));

    
    app.use(express.static('public/css'));
    app.use(express.static('public/js'));

    app.use(log);
    app.use(authenticationController);
    app.use(authorizationController);
    app.use('/api', apiController);
    app.use(staticFilesController);
    app.use(errorController);
    
    return app;
};