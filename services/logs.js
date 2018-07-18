class LogService {
    constructor(repository, errors) {
        this.repository = repository;
        this.errors = errors;
    }
    async create(data) {
        return await this.repository.create(data, {
            raw: true
        });
    }
    async readAll([limit, offset]) {
        return await this.repository.findAll({
            limit : limit,
            offset : offset,
            order: [
                ['Date','DESC']
            ],
            raw: true
        });
    }
}

module.exports = LogService;