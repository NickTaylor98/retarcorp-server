const CrudController = require('./crud');
const {checkAuth} = require('../helpers/authorization');
class TimeTableController extends CrudController {
    constructor(service) {
        super(service);
        this.registerRoutes();
    }

    async getTimetables(req) {
        const {userId} = req;
        const {login} = req.query;
        return login ? 
            await this.service.readAllByLogin(login) : 
            await this.service.readAllByUserID(userId);
    }

    async readAll(req, res) {
        const timetables = await this.getTimetables(req);
        const result = await this.checkAuthForObjects(req, timetables, 'timetables');
        if (!result) throw this.service.errors.unauthorized;
        res.json(timetables);
    }
    //TODO[read] - read with param date=... 
    
    async read(req, res) {
        const timetable = await this.service.read(req.params.id);
        const result = await checkAuth(req.ability, 'read', timetable);
        if (!result) throw this.service.errors.unauthorized;
        res.json(timetable);
    }

    async create(req, res) {
        const result = await checkAuth(req.ability, 'create', 'timetables');
        if (!result)  throw this.service.errors.unauthorized;
        const {userId} = req;
        const {login} = req.query;
        req.body.userId = login ? 
            (await this.service.userService.readByLogin(login)).id :
            userId;
        return super.create(req, res);
    }
    async update(req, res) {
        const {id} = req.params;
        const timetable = await this.service.read(id);
        const result = await checkAuth(req.ability, 'update', timetable);
        if (!result)  throw this.service.errors.unauthorized;
        return super.update(req, res);
    }

}

module.exports = (timetableService) => {
    const controller = new TimeTableController(timetableService);
    return controller.router;
}