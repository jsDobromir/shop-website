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
    console.log('Coming here');
    const prod = new Product(req.body.title,req.body.price,req.body.desc,req.body.image,null,req.user._id);
    prod.save()
        .then(product => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};


export const manageProductsView = async (req,res) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/adminproducts',{products,title : 'Admin area'});
        })
        .catch(err => {
            console.log(err);
        });
};

export const editProduct = (req,res,next) => {
    let productId = req.params.productId;
    Product.getProductById(productId)
        .then(product => {
            res.render('admin/editproduct',{title : `${product.title}`,product});
        })
        .catch(err => {
            console.log(err);
        });
};

export const editProductPost = (req,res,next) => {

    let prodId = req.params.productId;
    const imageUrl = req.body.image ? req.body.image : req.body.imageValue;
    const prod = new Product(req.body.title,req.body.price,req.body.desc,imageUrl,prodId);
    prod.save()
        .then(prod => {
            res.redirect(req.baseUrl + '/' + 'manageproducts');
        })
        .catch(err => {
            res.send(`Error updating product ${err}`);
            throw err;
        })
    // Product.editProduct(prod,productObj,products => {
    //     res.render('admin/adminproducts',{title : 'Admin area',products});
    // });

};

//Post route ,delete product
export const deleteProduct = (req,res) => {
    let id = req.params.id;
    Product.deleteById(id)
        .then( result => {
            console.log(result);
            res.redirect(req.baseUrl + '/' + 'manageproducts');
        })
        .catch(err => {
            res.redirect('back');
        });

};