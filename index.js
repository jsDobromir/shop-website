import express from 'express';
import path from 'path';
import {router as adminRoutes} from './routes/adminRoutes.js';
import {router as indexRoutes} from './routes/indexRoutes.js';
import {router as shopRoutes} from './routes/shopRoutes.js';
import {__dirname} from './helpers/pathHelper.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {mongoConnect} from './helpers/database.js';
import User from './models/user.js';

const app = express();
dotenv.config({});
app.set('view engine','pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findById('5ff4cc85a779ea185bd7197c')
        .then(user => {
            req.user =new User(user.name,user.email,user.cart,user._id);
            next();
        })
        .catch(err => {
            console.log(err);
            next();
        });
});

const PORT = process.env.PORT || 8000;

app.use('/',indexRoutes);
app.use('/admin',adminRoutes);
app.use('/shop',shopRoutes);

app.use((req,res,next) => {
    res.render('404',{title : '404'});
});

mongoConnect( () => {
    app.listen(PORT,() => {
        console.log(`Server listening on port ${PORT}`);
    });
});
