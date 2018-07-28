const CrudService = require('./crud');
class TaskService extends CrudService {
    constructor(repository, userService, errors) {
        super(repository, errors);
        this.userService = userService;
    }

    async getTasks(user)  {
        const tasks =  await user.getTasks();
        for (let task of tasks) {
            const users = await task.getUsers();
            task.dataValues.Users = [];
            for (user of users){
                task.dataValues.Users.push(user.Login);
            }
        }
        return tasks;
    } 
    async readAllByUserID(userID) {
        const user = await this.userService.read(userID);
        return await this.getTasks(user);
    }
    async readAllByLogin(login) {
        const user = await this.userService.readByLogin(login);
        return await this.getTasks(user);
    }
    async read (id) {
        const task = await super.read(id);
        task.users_tasks = [];
        const users = await task.getUsers();
        users.forEach((elem) => {
            task.users_tasks.push({userId: elem.id});
        });
        return task;
    }
    async create(data) {
        let {Users} = data;
        Users = (await Promise.all(
                    Users.map(async (login) => await this.userService.readByLogin(login, false))
                )).filter(n => n);
        if (Users.length === 0) throw this.errors.invalidParams;
        const task = await super.create(data, false);
        Users.forEach(user => {
            user.addTask(task);
        });
        return task;
    }
}

module.exports = TaskService;