'use strict';
const Sequelize = require('sequelize');
const config = require('./config.json');
module.exports = () => {
    const sequelize = new Sequelize(config.db, config.login, config.password, config.options);
    sequelize.authenticate().then(() => {
        console.log('Connection to database successful');
    }).catch((err) => {
        console.log('Unable to connect to database', err);
    });

    const timetables = require('../models/timetables')(Sequelize, sequelize);
    const reports = require('../models/reports')(Sequelize, sequelize);
    const users = require('../models/users')(Sequelize, sequelize);
    const tasks = require('../models/tasks')(Sequelize, sequelize);
    const logs = require('../models/logs')(Sequelize, sequelize);

    users.hasMany(timetables);
    timetables.belongsTo(users);

    users.hasMany(reports);
    reports.belongsTo(users);

    users.belongsToMany(tasks, {
        through: 'users_tasks'
    });
    tasks.belongsToMany(users, {
        through: 'users_tasks'
    });

    return {
        timetables,
        users,
        reports,
        tasks,
        logs,
        sequelize,
        Sequelize
    };
};