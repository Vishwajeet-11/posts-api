import httpStatus from 'http-status';
import Tag from '../models/Tag.js';

// create a tag
export async function create(req, res) {
    const tag = await Tag.create({ name: req.body.name });
    res.status(httpStatus.CREATED).json(tag);
}

// list tags with pagination
export async function list(req, res) {
    const { page, limit, sort, select } = req.query;
    const data = await Tag.paginate({}, { page, limit, sort, select, lean: true });
    res.json(data);
}
