const CrudController = require('./crud');
const {checkAuth} = require('../helpers/authorization');
const {hash, checkHash} = require('../helpers/hash');
class UserController extends CrudController {
    constructor(service) {
        super(service);
        this.routes = {
            '/': [
                { method: 'get', cb: this.readAll},
                { method: 'post',cb: this.create},
                { method: 'put', cb: this.update},
                { method: 'delete',  cb: this.delete }
            ],
            '/:id': [
                { method: 'get',  cb: this.read},
            ]
        };
        this.registerRoutes();
    }
    async create(req, res) {
        req.body.constructor.modelName = 'users'; // doing for checking abilities
        const result = await checkAuth(req.ability, 'create', req.body);
        if (!result) throw this.service.errors.unauthorized;
        req.body.Password = await hash(req.body.Password);
        return super.create(req, res);
    }
    async update(req, res) {
        const {userId} = req;
        let {oldPassword} = req.body;
        const user  = await this.service.read(userId);
        
        let result = await checkHash(oldPassword, user.Password);
        if (!result) throw this.service.errors.invalidParams;
        result = await checkAuth(req.ability, 'update', user);
        if (!result) throw this.service.errors.unauthorized;
        
        req.params.id = userId;
        req.body.Login = user.Login;
        req.body.Role = user.Role;
        req.body.Password = await hash(req.body.newPassword);
        return super.update(req, res);
    }
    async delete (req, res) {
        const {userId} = req;
        const {login} = req.query;
        const user =  login ? 
            await this.service.readByLogin(login):
            await this.service.read(userId);  
        const result = await checkAuth(req.ability, 'delete', user);
        if (!result) throw this.service.errors.unauthorized;
        req.params.id = userId;
        return super.delete(req, res);
    }
}

module.exports = (userService) => {
    const controller = new UserController(userService);
    return controller.router;
}