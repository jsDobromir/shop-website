import Product from '../models/product.js';
import multer from 'multer';
import jimp from 'jimp';
import {v4 as uuidv4} from 'uuid';

const multerOptions = {
    storage : multer.memoryStorage(),
    fileFilter : function(req,file,next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto){
            next(null,true);
        }
        else{
            next({message : 'That filetype isn\t allowed'},false);
        }
    }
};

export const renderProducts = (req,res) => {
    res.render('products',{title : 'Add Product'});
};

export const upload = multer(multerOptions).single('image');

export const resize = async (req,res,next) => {
    if(!req.file){
        return next();
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.image = `${uuidv4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(600,jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.image}`);
    next();
};

export const postProduct = (req,res) => {
    
    const prod = new Product(req.body.title,req.body.desc,req.body.price,req.body.image);
    prod.save();
    res.redirect('/');
    //const products = Product.fetchAll();
};


export const manageProductsView =  (req,res) => {
    Product.fetchAll(products => {
        res.render('admin/adminproducts',{products,title : 'Admin area'});
    });
};

export const editProduct = (req,res,next) => {
    Product.fetchAll(products => {
        let found = false;
        products.forEach(prod => {
            if(prod.title===req.params.title){
                found = true;
                return res.render('admin/editproduct',{title : `Edit ${prod.title}`,product : prod});
            }
        });
        if(!found){
            return next();
        }
    });
};

export const editProductPost = (req,res,next) => {

    let prod = req.params.title;
    let productObj = {title : req.body.title,price : req.body.price,desc : req.body.desc,image : req.body.image };
    Product.editProduct(prod,productObj,products => {
        res.render('admin/adminproducts',{title : 'Admin area',products});
    });

};

//Post route ,delete product
export const deleteProduct = (req,res) => {
    let id = req.params.id;

    Product.deleteProduct(id,products => {
        if(!products){
            console.log('Error deleting the product');
            res.redirect('/');
        }

        res.redirect('back');

    });

};