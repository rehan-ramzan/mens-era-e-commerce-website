import { string } from 'joi';
import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
    items: {type:Object, required:true},
    address: {type:String, required:true},
    phone: {type:String, required:true},
    paymentStatus:{type:Boolean, default:false},
    email:{type:String,required:true}
}) 

export default mongoose.model('Order',ordersSchema,'orders');