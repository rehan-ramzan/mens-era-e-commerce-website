import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import layout from 'express-ejs-layouts';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'express-flash';
import MongoStore from 'connect-mongo';
import { initRoutes } from './routes';
import passport from 'passport';

import initializingPassport from './app/config/passport.js';
import Path from 'path';

const app = express();

global.appRoot = Path.resolve(__dirname);

//mongo atlas connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser:true, useUnifiedTopology:true });
const connection = mongoose.connection;
connection.once('open',()=>{ console.log("Conneted to MongoAtlas Successfully.") })
.on('error',()=>{ console.log("Mongo Atlas Connection Declined") })

// session config
app.use(session({
    secret: process.env.COOKIES_SECRET,
    resave:false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        ttl: 60 * 60 *24
    })
}))

//passport config
initializingPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(layout);
app.use(flash());

// static files
app.use(express.static('public'))

// views config
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

initRoutes(app);


// global error handler middleware
const errorHandler = (error,req,res,next)=>{
    let status = 500;
    let data = {
        message: 'Internal Server Error',
        original_error: error.message
    }
    res.status(status).json(data);    
}
app.use(errorHandler)

// server config
app.listen(process.env.PORT, ()=>{
    console.log('Server is listening on port ',process.env.PORT);
})