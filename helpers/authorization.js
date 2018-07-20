'use strict';

const checkArray = (array, ability, action) => array.reduce((rc, element) => rc && ability.can(action, element), true);

const checkOneTask = (obj, ability, action) => {
    const rc = obj.users_tasks.reduce((rc, elem) => {
        obj.dataValues.users_tasks = elem;
        return rc || ability.can(action, obj);   
    }, false);
    delete obj.dataValues.users_tasks;
    return rc;
}

const checkSimpleObject = (obj, ability, action) => ability.can(action, obj);

module.exports.checkAuth = async (ability, action, obj) => {
    if (Array.isArray(obj)) 
        return checkArray(obj, ability, action);
    else if (Array.isArray(obj.users_tasks)) 
        return checkOneTask(obj, ability, action);
    else return checkSimpleObject(obj, ability, action);
}