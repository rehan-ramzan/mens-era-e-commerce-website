import Joi from 'joi';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../../../models';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
dotenv.config();
const authController = {
    //logout
    logout(req,res){
        req.logout((error)=>{
            if(error){
                return next(error);
            }
            res.redirect('/login');
        });
    },

    //login routes controllers
    login(req,res){
        res.render('login');
    },

    async postLogin(req,res,next){
        const cart = req.session.cart;
        passport.authenticate('local',(error,user,info)=>{
            if(error){
                req.flash('error',info.message);
                return next(error);
            }
            if(!user){
                req.flash('error',info.message);
                return res.redirect('/login')
            }
            req.login(user, (error)=>{
                if(error){
                    req.flash('error',info.message)
                    return next(error);
                }
                req.session.cart = cart;
                res.redirect('/')
            })
        })(req,res,next)
    },

    register(req,res){
        res.render('register');
    },

    async postRegister(req,res,next){
        const{  email, password, confirm_password } = req.body;        
        const usernameSchema = Joi.object({
            email: Joi.string().email().required()
            .messages({
                'string.empty':'email must required',
                'string.email':'invalid email'
        }),
            password: Joi.string().min(8).max(30).required()
            .messages({
                'string.empty': 'password must required',
                'string.min': 'password is too short',
                'string.max': 'password is too long'
            }),
            confirm_password: Joi.any().equal(Joi.ref('password')).required()
            .messages({ 
                'any.only': 'password does not match' 
            })
        })

        const { error } =  usernameSchema.validate(req.body);
        if(error){
            let key = error.details[0].context.key; 
            req.flash(`${key}_error`,error.message);
            req.flash("name", name);
            req.flash("email", email);
            return res.redirect('/register');
        }

        // check email already exists
        try{
            const exists = await User.exists({email})
            if(exists){
                req.flash('email_error','email already exists');
                req.flash('name',name);
                return res.redirect('/register')
            }

            // hashed password
            const hashPassword = await bcrypt.hash(password,10);
            
            // user model to insert data
            const user = new User({
                name, email, password: hashPassword
            })

            const saveUser = await user.save();
            res.redirect('/register');
        }
        catch(error){
            return next(error);
        }
    
    },

    account(req,res){
        res.render('user');
    },

    async updateAccount(req,res,next){
        const { password, confirmPassword } = req.body;
        const updateUserSchema =  Joi.object({
            password: Joi.string().min(8).max(30).required()
            .messages({
                'string.empty': 'password must required',
                'string.min': 'password is too short',
                'string.max': 'password is too long'
            }),
            confirmPassword: Joi.any().equal(Joi.ref('password')).required()
            .messages({ 
                'any.only': 'password does not match' 
            })
        }) 
        const { error } = updateUserSchema.validate({password, confirmPassword}); 
        if(error){
            return res.status(422).json({message:error.message});
        }
        const hashPassword = await bcrypt.hash(password,10);
        try{
            await User.findByIdAndUpdate(req.params.id, {password:hashPassword})
        }catch(error){
            return next(error);
        }      
        res.json({message:'updated successfully'});
    },


    async forgetPassword(req,res,next){
        const { email } = req.body;
        const emailSchema = Joi.object({
            email: Joi.string().email().required()
            .messages({
                'string.empty':'email must required',
                'string.email':'invalid email'
            })
        })
        const {error} = emailSchema.validate({email});
        if(error){
            return res.status(422).json({message:error.message})
        } 
        try{
           const user = await User.findOne({email});
            if(!user){
                return res.status(404).json({message:'user not found'});
            }
            //create a one time link valid for 10 minutes
            const secret = process.env.JWT_SECRET + user.password;
            const payload = {
                email: user.email,
                id: user._id
            } 
            const token = jwt.sign(payload,secret,{expiresIn:'10m',})
            
            const link = `${process.env.APP_URL}/reset-password/${user._id}/${token}`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.USER,
                  pass: process.env.PASSWORD
                }
              });
              
              var mailOptions = {
                from: process.env.USER,
                to: email,
                subject: 'Reset Password',
                text: link
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  return next(error);
                } else {  
                    console.log("Email send ");
                    return res.json({message:'email send successfully'});
                }
              });
        }catch(error){  
            return next(error);
        }
    },

    async getResetPassword(req,res,next){
        const {id,token} = req.params;
        try{
            const user = await User.findOne({_id:id});
            if(!user){
                return res.json({message:'invalid user'});
            }
            const secret = process.env.JWT_SECRET + user.password;
            const verifyToken = jwt.verify(token,secret);
            res.render('update-password',{email:verifyToken.email});        
        }catch(error){
            return next(error);
        }
    },
    
    async setResetPassword(req,res,next){
        const {id,token} = req.params;
        const {password,confirmPassword} = req.body   
        const confirmSchema = Joi.object({
            password: Joi.string().min(8).max(30).required()
            .messages({
                'string.empty': 'password must required',
                'string.min': 'password is too short',
                'string.max': 'password is too long'
            }),
            confirmPassword: Joi.any().equal(Joi.ref('password')).required()
            .messages({ 
                'any.only': 'password does not match' 
            })
        }) 
        const {error} = confirmSchema.validate({password,confirmPassword});
        if(error){
            return res.status(422).json({message:error.message})
        }
        try{
            const user = await User.findOne({_id:id});
            if(!user){
                return res.json({message:'invalid user'});
            }
            const secret = process.env.JWT_SECRET + user.password;
            const verifyToken = jwt.verify(token,secret);
            const hashPass = await bcrypt.hash(password,10);
            await User.findByIdAndUpdate(id,{password:hashPass});
            return res.json({url:`${process.env.APP_URL}/login`});
        }catch(err){
            return next(err);
        }
    }
}
export default authController;