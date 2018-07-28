const CrudController = require('./crud');
const {checkAuth} = require('../helpers/authorization');
class TaskController extends CrudController {
    constructor(service) {
        super(service);
        this.routes['/:id'].push({method : 'delete', cb : this.delete});
        this.registerRoutes();
    }

    async getTasks(req){
        const {userId} = req;
        const {login} = req.query;
        return login ? 
            await this.service.readAllByLogin(login) :
            await this.service.readAllByUserID(userId);
    }
    async readAll(req, res) {
        const tasks = await this.getTasks(req);
        const result = await this.checkAuthForObjects(req, tasks, 'tasks');
        if (!result) throw this.service.errors.unauthorized;
        res.json(tasks);
    }
    async read(req, res) {
        const task = await this.service.read(req.params.id);
        const result = await checkAuth(req.ability, 'read', task);
        if (!result) throw this.service.errors.unauthorized;
        res.json(task);
    }
    async create (req, res) {
        const result = await checkAuth(req.ability, 'create', 'tasks');
        if (!result) throw this.service.errors.unauthorized;
        req.body.Users = JSON.parse(req.body.Users);
        return super.create(req, res);
    }
    async update(req, res) {
        const task = await this.service.read(req.params.id);
        const result = await checkAuth(req.ability, 'update', task);
        if (!result) throw this.service.errors.unauthorized;
        return super.update(req, res);
    }
    async delete(req, res) {
        const task = await this.service.read(req.params.id);
        const result = await checkAuth(req.ability, 'delete', task);
        if (!result) throw this.service.errors.unauthorized;
        return super.delete(req, res);
    }
}

module.exports = (taskService) => {
    const controller = new TaskController(taskService);
    return controller.router;
}