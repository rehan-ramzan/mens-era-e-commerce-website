import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    off: {type:Number, required: true},
    image: {type: Array, required:true},
    description: {type: String},
    size: {type:Array}
},{ timestamps:true });

export default mongoose.model('Product',productSchema,'products');