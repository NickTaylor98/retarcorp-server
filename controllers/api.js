const express = require('express');

module.exports = (
    userService,
    reportService,
    taskService,
    timetableService,
    readLogs
) => {
    const router = express.Router();

    const userController = require('./users')(userService);
    const reportController = require('./reports')(reportService);
    const taskController = require('./tasks')(taskService);
    const timetableController = require('./timetables')(timetableService);
    
    router.use('/logs', readLogs);
    router.use('/users', userController);
    router.use('/timetables', timetableController);
    router.use('/tasks', taskController);
    router.use('/reports', reportController);
    
    
    return router;
};