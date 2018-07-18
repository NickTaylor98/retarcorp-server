'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('reports', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Date : {
            type: Sequelize.STRING,
            allowNull : false
        },
        MainText: {
            type: Sequelize.STRING(512),
            allowNull : false
        },
        Note: {
            type: Sequelize.STRING(512)
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'Date']
            }
        ]
    });
}