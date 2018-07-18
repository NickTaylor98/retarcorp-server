'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('tasks', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Period: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Description: {
            type: Sequelize.STRING(512),
            allowNull: false
        },
        Note: {
            type: Sequelize.STRING(512),
        }
    })
}