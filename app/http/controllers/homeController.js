import { Product } from "../../models";
import Joi from 'joi';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

const homeController = {
    async index(req,res,next){
        let latestProducts;
        try{
            latestProducts= await Product.find().sort({_id:-1}).limit(12); 
        }catch(error){
            return next(error);
        }
        res.render('home', {latestProducts});
    },

    contactIndex(req,res){
        res.render('contact')
    },

    async message(req,res,next){
        const {user,email,message} = req.body;
        const messageSchema = Joi.object({
            user: Joi.string().min(3).required(),
            email:Joi.string().email().required(),
            message:Joi.string().min(5).required()
        })
        const {error} = messageSchema.validate({user,email,message})
        if(error){
            res.status(422).json({message:error.message})
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD
            }
          });
          var mailOptions = {
            from: email,
            to: process.env.user,
            subject: "Query Regarding Mens' Era",
            text: message
          };
          try{
            const result = await transporter.sendMail(mailOptions)
            return res.json({message:'email send'})
          }catch(error){
            return next(error);
          }
    }
}
export default homeController;