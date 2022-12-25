import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verified: {type:Boolean},
    role: {type: String, default:'customer'}
},{timestamps: true});

export default mongoose.model('User',userSchema,'users');