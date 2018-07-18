const CrudController = require('./crud');
const {checkAuth} = require('../helpers/authorization');
class ReportController extends CrudController {
    constructor(service) {
        super(service);
        this.registerRoutes();
    }

    async getReports(req) {
        const {userId} = req;
        const {login} = req.query;
        return login ? 
            await this.service.readAllByLogin(login) : 
            await this.service.readAllByUserID(userId);
    }

    async readAll(req, res) {
        const reports = await this.getReports(req);
        const result = await this.checkAuthForObjects(req, reports, 'reports');
        if (!result) throw this.service.errors.unauthorized;
        res.json(reports);
    }
    async read(req, res) {
        const report = await this.service.read(req.params.id);
        const result = await checkAuth(req.ability, 'read', report);
        if (!result) throw this.service.errors.unauthorized;
        res.json(report);
    }
    async create(req, res) {
        req.body.userId = req.userId;
        const result = await checkAuth(req.ability, 'create', 'reports');
        if (!result) throw this.service.errors.unauthorized;
        return super.create(req, res);
    }
    async update(req, res) {
        const report = await this.service.read(req.params.id);
        const result = await checkAuth(req.ability, 'update', report);
        if (!result) throw this.service.errors.unauthorized;
        return super.update(req, res); 
    }
    
}

module.exports = (reportService) => {
    const controller = new ReportController(reportService);
    return controller.router;
}