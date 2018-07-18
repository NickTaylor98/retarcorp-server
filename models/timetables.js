'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('timetables', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Date : {type: Sequelize.STRING, allowNull : false} ,
        In: { type: Sequelize.STRING},
        Out: { type: Sequelize.STRING},
        Lunch : { type : Sequelize.STRING},
    }, {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'Date']
            }
        ]
    });
}