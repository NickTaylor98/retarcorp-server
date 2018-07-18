'use strict';
module.exports.checkAuth = async (ability, action, obj) => {
    if (Array.isArray(obj)) {
        let rc = true;
        obj.forEach(element => {
            rc = rc && ability.can(action, element);
        });    
        return rc;
    } else if (Array.isArray(obj.users_tasks)) //for checking one task 
        {
            let rc = false;
            obj.users_tasks.forEach(elem => {
                obj.dataValues.users_tasks = elem;
                rc = rc || ability.can(action, obj);   
            });
            delete obj.dataValues.users_tasks;
            return rc;
        }
    else return ability.can(action, obj)
}