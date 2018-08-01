'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Login: {
            type: Sequelize.STRING,
            unique: true,
            allowNull : false
        },
        Password : {
            type: Sequelize.STRING,
            allowNull : false    
        },
        Name: {
            type: Sequelize.STRING,
            allowNull : false
        },
        Email : {
            type: Sequelize.STRING,
            allowNull : false
        },
        Role: {
            type: Sequelize.ENUM,
            values: ['admin', 'helper', 'user']
        }
    })
}