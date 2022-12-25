import { Product } from "../../../models";
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import url from 'url';
const productController = {

    async index(req,res){
        let products;
        try{
            products = await Product.find().sort({_id:-1}); 
        }catch(error){
            return next(error)
        }
        res.render('product',{products});
    },

    async store(req,res,next){
        const {name, price, off ,description ,size} = req.body;
        if(!req.files){
            return res.status(422).json({'message':'images must require'});
        }
        const image = [];
        for(let i=0; i<req.files.length; i++){
            image[i] = req.files[i].filename;
        }

        const productSchema = Joi.object({
            name: Joi.string().required(),
            price:Joi.number().required(),
            off:Joi.number().required(),
            description:Joi.string().min(2).required()
        });
        const { error } = productSchema.validate({name,price,off,description});
        if(error){
            for(let i=0; i<req.files.length; i++){
                fs.unlink(`${req.files[i].destination}/${req.files[i].filename}`,(err)=>{
                    if(err){
                        return next(err);
                    }
                })
            }
            return res.status(422).json({'message':error.message});
        }
        let product;
        try{
            product =  await Product.create({name,price,off,image,description,size});
        }
        catch(err){
            return next(err);
        }
        res.status(201).json(product);
    },

    async destroy(req,res,next){
        try{
           const product= await Product.findByIdAndDelete(req.params.id);
           for(let img of product.image){
            const filePath = path.join(appRoot,'/public/assests/Products',img);
            fs.unlink(filePath,(err)=>{
                if(err){
                    return next(err);
                    }
                })
            }
        }catch(error){
            return next(error);
        }
        res.status(201).json({'message':'deleted successfully'});
    },

    async update(req,res,next){          
        const {name,price,off,description} = req.body;
        const productSchema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required()
        });
        const {error} = productSchema.validate({name,price});
        if(error){
            return res.status(422).json({'message':error.message});
        }
        let document;
        try{
            document = await Product.findOneAndUpdate({_id:req.params.id},{
                name,
                price,
                ...(off && {off}),
                ...(description && {description})
            },{new:true})
        }
        catch(err){
            return next(err);
        }
        res.status(201).json(document);
    }
}
export default productController;