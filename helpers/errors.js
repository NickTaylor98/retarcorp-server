'use strict';
module.exports = {
    unauthorized: {
        message: 'Unauthorized',
        code: 'unauthorized',
        status: 403
    },
    invalidId: {
        message: 'Invalid id',
        code: 'invalid_id',
        status: 400
    },
    notFound: {
        message: 'Entity not found',
        code: 'entity_not_found',
        status: 404
    },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied',
        status: 403
    },
    invalidData: {
        message: 'Invalid data',
        code: 'invalid_data',
        status: 400
    },
    invalidParams : {
        message: 'Invalid params',
        code: 'invalid_params',
        status: 400
    },
    alreadyExists : {
        message : 'Already exists. To create new timetable you should update existing one',
        code : 'already_exists',
        status : 400
    }
}