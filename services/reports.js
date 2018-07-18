const CrudService = require('./crud');
class ReportService extends CrudService {
    constructor(repository, userService, errors) {
        super(repository, errors);
        this.userService = userService;
    }
    async readAllByLogin(login) {
        const user = await this.userService.readByLogin(login);
        return await user.getReports();
    }
    async readAllByUserID(userID) {
        const user = await this.userService.read(userID);
        return await user.getReports();
    }
    async create(data) {
        data.userId = parseInt(data.userId);
        if (isNaN(data.userId)) throw this.errors.invalidData;
        return super.create(data);
    }
}

module.exports = ReportService;