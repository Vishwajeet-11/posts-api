import { Schema, model } from 'mongoose';
import paginate from '../plugins/paginate.plugin.js';


const postSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        desc: { type: String, default: '' },
        image: { type: String, default: '' }, // public URL
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
    },
    { timestamps: true }
);


postSchema.index({ title: 'text', desc: 'text' }); // for text search


postSchema.plugin(paginate);


export default model('Post', postSchema);