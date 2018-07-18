const CrudService = require('./crud');
class TimeTableService extends CrudService {
    constructor(repository, userService, errors) {
        super(repository, errors);
        this.userService = userService;
    }
    async readAllByUserID(userID) {
        const user = await this.userService.read(userID);
        return await user.getTimetables();
    }
    async readAllByLogin(login) {
        const user = await this.userService.readByLogin(login);
        return await user.getTimetables();
    }

}

module.exports = TimeTableService;