import {Product} from '../models/product.js';
import multer from 'multer';
import jimp from 'jimp';
import {v4 as uuidv4} from 'uuid';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import {__dirname} from '../helpers/pathHelper.js';

import expValidator from 'express-validator';
const {validationResult} = expValidator;

// const multerOptions = {
//     storage : multer.memoryStorage(),
//     fileFilter : function(req,file,next) {
//         const isPhoto = file.mimetype.startsWith('image/');
//         if(isPhoto){
//             next(null,true);
//         }
//         else{
//             next({message : 'That filetype isn\t allowed'},false);
//         }
//     }
// };

export const renderProducts = (req,res) => {
    
    res.render('products',{title : 'Add Product',isAuth : req.session.user,errors : null,oldInfo : {title : '',price : '',description : '',imageUrl : ''}});
};

// export const upload = multer(multerOptions).single('image');

// export const resize = async (req,res,next) => {
//     if(!req.file){
//         return next();
//     }
//     const extension = req.file.mimetype.split('/')[1];
//     req.body.image = `${uuidv4()}.${extension}`;
//     const photo = await jimp.read(req.file.buffer);
//     await photo.resize(600,jimp.AUTO);
//     await photo.write(`./public/uploads/${req.body.image}`);
//     next();
// };

export const postProduct = (req,res,next) => {
    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.desc;
    let image = req.file;
    console.log(image);
    if(!image){
        return res.status(422).render('products', {
            title : 'Add Product',
            isAuth : req.session.user,
            oldInfo : {title,price,description},
            errors : [{msg : 'Attached file is not an image'}]
        });
    }
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(422).render('products',{title : 'Add Product',isAuth : req.session.user,errors : errors.array(),oldInfo : {title,price,description}});
    }

    const imageUrlSplit = image.path.split('/');
    const imageUrl = imageUrlSplit[1] + '/' + imageUrlSplit[2];

    const prod = new Product({title : req.body.title,price : req.body.price,description : req.body.desc,imageUrl : imageUrl,userId : req.user._id});
    prod.save()
        .then(product => {
            res.redirect('/');
        })
        .catch(err => {
            //const errorsArr = [{msg : "Database operation failed, please try again"}];
            //console.log(err);
            //return res.redirect('/500');
            //return res.status(500).render('products',{title : 'Add Product',isAuth : req.session.user,errors : errorsArr,oldInfo : {title,price,description,imageUrl}});
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


export const manageProductsView = async (req,res) => {
    Product.find({})
        .then(products => {
            res.render('admin/adminproducts',{products,title : 'Admin area',isAuth : req.session.user});
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    // Product.fetchAll()
    //     .then(products => {
    //         res.render('admin/adminproducts',{products,title : 'Admin area'});
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
};

export const editProduct = (req,res,next) => {
    let productId = req.params.productId;
    Product.findById({_id : productId})
        .then(product => {
            res.render('admin/editproduct',{title : `${product.title}`,oldInfo : {prodId : product._id,title : product.title,price : product.price,description : product.description,imageUrl : product.imageUrl},isAuth : req.session.user,errors : null});
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

export const editProductPost = (req,res,next) => {

    let prodId = req.params.productId;
    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.desc;
    let imageUrl = req.file;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(422).render('admin/editproduct',{title : 'Add Product',isAuth : req.session.user,errors : errors.array(),oldInfo : {prodId,title,price,description}});
    }

    if(imageUrl){
        const imageUrlSplit = imageUrl.path.split('/');
        imageUrl = imageUrlSplit[1] + '/' + imageUrlSplit[2];
    }

    Product.findByIdAndUpdate({_id : prodId},{title : req.body.title,price : req.body.price,description : req.body.desc,imageUrl : imageUrl})
        .then(prod => {
            res.redirect(req.baseUrl + '/' + 'manageproducts');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//Post route ,delete product
export const deleteProduct = (req,res) => {
     let id = req.params.id;

    const directoryPath = path.join(__dirname,'public','images');
    console.log(directoryPath);
    Product.findById({_id : id})
        .then(product => {
            const imageUrl = product.imageUrl.split('/')[1].toString();
            fs.readdir(directoryPath,function(err,files){
                if(err){
                    return console.log('Unable to scan directory: ' + err);
                }
                files.forEach(function(file){
                    
                    if(file.toString()===imageUrl){
                        fs.unlink(path.join(directoryPath,file),(err) => {
                            if(err) console.log(`Error deleting file ${err}`);
                            console.log('file deleted',file);
                        })
                    }
                })
            });
        });

    Product.deleteOne({_id : id})
        .then( result => {
            const directoryPath = path.join(__dirname,'images');
            res.redirect(req.baseUrl + '/' + 'manageproducts');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};