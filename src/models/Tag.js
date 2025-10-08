import { Schema, model } from 'mongoose';
import paginate from '../plugins/paginate.plugin.js';


const tagSchema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true, minlength: 1, maxlength: 50 }
    },
    { timestamps: true }
);


tagSchema.plugin(paginate);


export default model('Tag', tagSchema);