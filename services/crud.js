'use strict';
class CrudService {
    constructor(rep, errors) {
        this.repository = rep;
        this.errors = errors;
        this.default = {
            options: {
                limit: 5,
                offset: 0,
                sortOrder: 'asc',
                sortField: 'id'
            }
        }
    }
    async readChunk(options) {
        const opts = Object.assign({}, this.default.options, options);
        let {limit,offset} = opts;
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (isNaN(limit) || isNaN(offset)) throw this.errors.invalidParams;
        return await this.repository.findAll({
            attributes: options.attributes,
            limit: limit,
            offset: offset,
            order: [
                [
                    opts.sortField,
                    opts.sortOrder.toUpperCase()
                ]
            ],
            raw: true
        });
    }

    async read(id) {
        id = parseInt(id);
        if (isNaN(id)) throw this.errors.invalidId;
        const item = await this.repository.findById(id);
        if (!item) {
            throw this.errors.notFound;
        }
        return item;
    }


    async create(data, raw = true) {
        const item =  await this.repository.create(data);
        return raw ? item.get({plain : true}) : item;
    }

    async update(id, data) {
        await this.repository.update(data, {
            where: {
                id: id
            },
            limit: 1
        });
        return this.read(id);
    }
    async delete(id) {
        return await this.repository.destroy({
            where: {
                id: id
            }
        });
    }

}

module.exports = CrudService;