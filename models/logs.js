'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('logs', {
        id: {type: Sequelize.INTEGER,primaryKey: true,autoIncrement: true},
        Date: {type: Sequelize.DATE, allowNull : false},
        IP: {type: Sequelize.STRING, allowNull : false},
        URL: {type: Sequelize.STRING},
        Method: {type: Sequelize.STRING(10), allowNull: false},
        Body: {type: Sequelize.STRING(512)}
    })
}