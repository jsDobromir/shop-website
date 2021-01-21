import {User} from '../models/user.js';
import brycpt from 'bcryptjs';
import nodemialer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import crypto from 'crypto';

import expValidator from 'express-validator';
const {validationResult} = expValidator;

const transporter = nodemialer.createTransport(sendgridTransport({
    auth : {
        api_key : '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'
    }
}));

export const renderLoginView = (req,res) => {
    
    let errors = req.flash('error');
    let success = req.flash('success');
    let errorsOutput = [];
    if(success.length > 0){
        success = success;
    }
    else{
        success = null;
    }
    if(errors.length > 0){
        for(let error of errors){
            errorsOutput.push({'msg' : error});
        }
    }
    else{
        errorsOutput = null;
    }

    res.render('auth/login',{title : 'Login Page',isAuth : req.session.user,errors : errorsOutput,success : success,oldInfo : {email : '',password : ''}});
};


export const postLogin = (req,res) => {

    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(422).render('auth/login',{title : 'Login',isAuth : req.session.user,errors : errors.array(),oldInfo : {email,password}});
    }

    User.findOne({email : email})
        .then(userDoc => {

            if(userDoc){
                brycpt.compare(password,userDoc.password)
                    .then(result => {
                        if(result===true){
                            console.log(result);
                            req.session.isLoggedIn = true;
                            req.session.user =userDoc;
                            req.session.save((err) => {
                                console.log(err);
                                return res.redirect('/');
                            });
                        }
                        else{
                            let errorArray = [];
                            errorArray.push({msg : 'Invalid email or password'});
                            return res.status(422).render('auth/login',{title : 'Login',isAuth : req.session.user,errors : errorArray,oldInfo : {email,password}});
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        return res.redirect('/auth/login');
                    });
            }
            else{
                let errorArray = [];
                            errorArray.push({msg : 'Invalid email or password'});
                return res.status(422).render('auth/login',{title : 'Login',isAuth : req.session.user,errors : errorArray,oldInfo : {email,password}});
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // User.findById('5ff9e637ac05de717ae38edf')
    //     .then(user => {
    //         req.session.isLoggedIn = true;
    //         req.session.user =user;
    //         req.session.save((err) => {
    //             console.log(err);
    //             res.redirect('/');
    //         });
    //     })
    //     .catch(err => {
    //         console.log(`Error finding user : ${err}`);
    //     });
};

export const logout = (req,res) => {

    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });

};

export const registerView = (req,res) => {

    let errors = req.flash('error');

    if(errors.length > 0){
        errors = errors;
    }

    else{
        errors = null;
    }

    res.render('auth/register',{title : 'Register',isAuth : req.session.user,errors : errors,oldInfo : {username : '',email : '',password : '',password2 : ''}});

};

export const registerPost = (req,res) => {

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(422).render('auth/register',{title : 'Register',isAuth : req.session.user,errors : errors.array(),oldInfo : {username,email,password,password2}});
    }

            brycpt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name : username,
                        email : email,
                        password : hashedPassword,
                        cart : {items : []}
                    });
                return user.save();
            })
            .then(result => {
                res.redirect('/auth/login');
                return transporter.sendMail({
                    to : email,
                    from : 'shop@node-complete.com',
                    subject : 'Signup succeed',
                    html : '<h1>You successfully signed up!</h1>'
                });
                
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
        

};


//render reset page
export const getReset = (req,res,next) => {

    let errors = req.flash('error');

    if(errors.length > 0){
        errors = errors;
    }

    else{
        errors = null;
    }

    res.render('auth/reset',{title : 'Reset password',errors : errors});
};


export const postReset = (req,res,next) => {
    
    crypto.randomBytes(32, (err,buffer) => {
        if(err){
            console.log(err);
            return res.redirect('/auth/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({email : req.body.email}).then(user => {
            if(!user){
                req.flash('error','Wrong email,please try again');
                return res.redirect('/auth/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            res.redirect('/');
            transporter.sendMail({
                to : req.body.email,
                from : 'shop@node-complete.com',
                subject : 'Password Reset',
                html : `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:9000/auth/reset/${token}">link</a> to set a new password</p>
                `
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    });
}

export const resetTokenHandler = (req,res,next) => {

    let token = req.params.token;

    User.findOne({resetToken : token, resetTokenExpiration : {$gt : Date.now()}})
        .then(user => {
            if(!user){
                req.flash('error','Your token is invalid,try again');
                return res.redirect('/auth/reset');
            }
            let errors = req.flash('error');

            if(errors.length > 0){
                errors = errors;
            }

            else{
                errors = null;
            }
            res.render('auth/new_pass',{title : 'Set new password',errors : errors,userId : user._id.toString(),passportToken : token});
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

export const resetPassportPost = (req,res,next) => {

    let userId = req.body.userId;

    let password = req.body.password;

    let password2 = req.body.password2;

    const passportToken = req.body.passportToken;

    let resetUser;

    if(password!==password2){
        req.flash('error','Passwords do not match');
        return res.redirect('back');
    }

    else{

        User.findOne({resetToken : passportToken, resetTokenExpiration : {$gt : Date.now()},_id : userId})
            .then(user => {
                resetUser = user;
                return brycpt.hash(password,12);
            })
            .then(hashedPassword => {
                resetUser.password = hashedPassword;
                resetUser.resetToken = undefined;
                resetUser.resetTokenExpiration = undefined;
                return resetUser.save();
            })
            .then(updatedUser => {
                req.flash('success','Password successfully reset');
                return res.redirect('/auth/login');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }

};