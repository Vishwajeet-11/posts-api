function parseSort(sortStr = '') {
    if (!sortStr) return { createdAt: -1 };
    return sortStr.split(',').reduce((acc, token) => {
        const [field, dir = 'asc'] = token.split(':');
        acc[field] = dir.toLowerCase() === 'desc' ? -1 : 1;
        return acc;
    }, {});
}

function paginatePlugin(schema) {
    schema.statics.paginate = async function (filter = {}, options = {}) {
        const page = Math.max(parseInt(options.page || 1, 10), 1);
        const limit = Math.max(parseInt(options.limit || 10, 10), 1);
        const sort = parseSort(options.sort);
        const select = options.select || '';
        const populate = options.populate || '';
        const lean = options.lean !== false;

        const query = this.find(filter).sort(sort).select(select);
        if (populate) query.populate(populate);
        if (lean) query.lean();

        const [results, total] = await Promise.all([
            query.skip((page - 1) * limit).limit(limit),
            this.countDocuments(filter),
        ]);

        return { results, page, limit, total, totalPages: Math.ceil(total / limit) };
    };
}

export default paginatePlugin;   // <- export the function itself
