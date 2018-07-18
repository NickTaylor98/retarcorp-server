const CrudService = require('./crud');
class UserService extends CrudService {
    constructor(repository, errors) {
        super(repository, errors);
    }
    async readByLogin(login, check = true) {
        const user = await this.repository.findOne({ where : {Login : login}}); 
        if (!user && check) throw this.errors.notFound;
        return user;
    }
}

module.exports = UserService;