import Product from '../models/product.js';


export const renderShop = async (req,res) => {
    Product.fetchAll()
        .then(products => {
            res.render('index',{products,title : 'Index Page'});
        })
        .catch(err => {
            console.log(err);
        });
    
};


export const getCart = (req,res) => {

    req.user.getCart()
        .then(products => {
            res.render('cart',{title : 'Cart',products});
        })
        .catch(err => console.log(err));
};