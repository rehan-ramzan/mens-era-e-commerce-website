import passportLocal from 'passport-local';
import { User } from '../models';
import bcrypt from 'bcrypt';
const LocalStrategy = passportLocal.Strategy;

function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'},async(email,password,done)=>{
        try{
            const user = await User.findOne({email}); 
            if(!user){
                return done(null,false,{message:'invalid username or password'})
            }
            const match  = await bcrypt.compare(password,user.password);
            if(match){
                return done(null,user,{message:'Login Successfully'});
            }
            return done( null,false,{message:'Invalid username or password'} )
        }
        catch(error){
            return done(error, false, {message:"Somethig went wrong"})
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await User.findById(id); 
            done(null,user);
        }catch(error){
            done(error,false);
        }
    })
}

export default init;