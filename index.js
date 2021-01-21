import express from 'express';
import path from 'path';
import {router as adminRoutes} from './routes/adminRoutes.js';
import {router as indexRoutes} from './routes/indexRoutes.js';
import {router as shopRoutes} from './routes/shopRoutes.js';
import {router as authRoutes} from './routes/authRoutes.js';
import {__dirname} from './helpers/pathHelper.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import {default as connectMongoDBSession} from 'connect-mongodb-session';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import csrf from 'csurf';
import {User} from './models/user.js';
import multer from 'multer';

const MONGODB_URI = 'mongodb+srv://dobrganch89:France123@cluster0.8b8r3.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

const MongoDBStore = connectMongoDBSession(session);
const store = MongoDBStore({
    uri : MONGODB_URI,
    collection : 'sessions'
});

const csrfProtection = csrf();
app.use(express.static(path.join(__dirname, 'public')));

const fileStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, path.join(__dirname,'/public/images/'));
    },
    filename : (req,file,cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

dotenv.config({});

app.set('view engine','pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer( {storage : fileStorage,fileFilter : fileFilter} ).single('image'));


app.use(session({secret : 'my secret',resave : false, saveUninitialized : false, store : store}));

app.use(csrfProtection);

app.use(flash());

app.use((req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req,res,next) => {
    if(!req.session.user){
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(err);
        });
});


const PORT = process.env.PORT || 8000;

app.use('/',indexRoutes);
app.use('/admin',adminRoutes);
app.use('/shop',shopRoutes);
app.use('/auth',authRoutes);

app.use((req,res,next) => {
    res.render('404',{title : '404'});
});

app.use((error,req,res,next) => {
    console.log(error);
    res.status(500).render('500',{title : 'Error page',error : error});
}); 

mongoose.connect(MONGODB_URI,{useUnifiedTopology : true,useNewUrlParser : true})
    .then(conn => {
        app.listen(PORT,() => {
            console.log('Connected to mongoDb');
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
