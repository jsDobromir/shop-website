import Product from '../models/product.js';


export const renderShop = (req,res) => {
    Product.fetchAll(products => {
        res.render('index',{products,title : 'Index Page'});
    });
};


export const getCart = (req,res) => {

    res.render('cart',{title : 'Cart'});
};