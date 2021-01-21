import express from 'express';
import {renderLoginView,postLogin,logout,registerView,registerPost,getReset,postReset,resetTokenHandler,resetPassportPost} from '../controllers/authController.js';
import expValidator from 'express-validator';
const {check,body} = expValidator;
export const router = express.Router();

import {User} from '../models/user.js';

router.get('/login',renderLoginView);

router.post('/login',[
    check('email').isEmail().withMessage('Please enter a valid email'),
    body('password','Password should contain only letters and numbers and be at least 5 characters').isLength({min : 5}).isAlphanumeric()
    ]   
    ,postLogin);

router.post('/logout',logout);

router.get('/register',registerView);

router.post('/register',[
        check('email').isEmail().withMessage('Please enter a valid email')
        .custom((value,{req}) => {
            return User.findOne({email : value})
                .then(userDoc => {
                    if(userDoc){
                        return Promise.reject('E-mail exists already,please use other one');
                    }
                })
        }), 
        body('password','Password should contain only letters and numbers and be at least 5 characters').isLength({min : 5}).isAlphanumeric(),
        body('password2').custom((value, {req}) => {
            if(value!==req.body.password){
                throw new Error('Passwords have to match!');
            }
            return true;
        })
    ],registerPost);

router.get('/reset/:token',resetTokenHandler);

router.get('/reset',getReset);

router.post('/reset',postReset);

router.post('/resetPassword',resetPassportPost);

