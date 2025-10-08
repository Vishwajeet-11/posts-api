import httpStatus from 'http-status';
import { uploadToS3 } from '../config/s3.js';
import Post from '../models/Post.js';
import Tag from '../models/Tag.js';
import catchAsync from '../utils/catchAsync.js';
import { uploadSingleImage } from '../utils/multer.js';

export const uploadImage = uploadSingleImage;
export const create = catchAsync(async (req, res) => {
    const { title, desc, tags = [] } = req.body;


    // Normalize tags: accept names or IDs
    let tagIds = [];
    if (Array.isArray(tags) && tags.length) {
        const docs = await Tag.find({
            $or: [
                { _id: { $in: tags.filter((t) => t.match(/^\w{24}$/)) } },
                { name: { $in: tags } }
            ]
        });
        tagIds = docs.map((d) => d._id);
    }


    let imageUrl = '';
    if (req.file) {
        imageUrl = await uploadToS3(req.file.buffer, req.file.mimetype, 'posts', title || 'post');
    }


    const post = await Post.create({ title, desc, image: imageUrl, tags: tagIds });
    res.status(httpStatus.CREATED).json(post);
});

export const update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, desc, tags } = req.body;


    const update = {};
    if (title !== undefined) update.title = title;
    if (desc !== undefined) update.desc = desc;
    if (tags !== undefined) {
        const docs = await Tag.find({
            $or: [
                { _id: { $in: (Array.isArray(tags) ? tags : [tags]).filter((t) => String(t).match(/^\w{24}$/)) } },
                { name: { $in: Array.isArray(tags) ? tags : [tags] } }
            ]
        });
        update.tags = docs.map((d) => d._id);
    }


    if (req.file) {
        update.image = await uploadToS3(req.file.buffer, req.file.mimetype, 'posts', update.title || 'post');
    }


    const post = await Post.findByIdAndUpdate(id, update, { new: true });
    if (!post) return res.status(NOT_FOUND).json({ message: 'Post not found' });
    res.json(post);
});

export const get = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('tags').lean();
    if (!post) return res.status(NOT_FOUND).json({ message: 'Post not found' });
    res.json(post);
});


export const remove = catchAsync(async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(NOT_FOUND).json({ message: 'Post not found' });
    res.status(NO_CONTENT).send();
});

export const list = catchAsync(async (req, res) => {
    const { page, limit, sort, fields, select, search, tags } = req.query;


    const filter = {};
    if (search) {
        filter.$text = { $search: search };
    }
    if (tags) {
        const tokens = String(tags).split(',').map((t) => t.trim()).filter(Boolean);
        const tagDocs = await Tag.find({
            $or: [
                { _id: { $in: tokens.filter((t) => t.match(/^\w{24}$/)) } },
                { name: { $in: tokens } }
            ]
        }).select('_id');
        filter.tags = { $in: tagDocs.map((t) => t._id) };
    }


    const data = await Post.paginate(filter, {
        page,
        limit,
        sort,
        select: select || fields || 'title desc image tags createdAt',
        populate: 'tags',
        lean: true
    });


    res.json(data);
});

export const searchPosts = (req, res, next) => {
    req.query.search = req.query.search ?? '';
    return list(req, res, next);
};