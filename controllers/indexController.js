import {Product} from '../models/product.js';
import {User} from '../models/user.js';

export const renderShop = async (req,res) => {

    const products = await Product.find({}).populate('userId');
    
    if(req.session.isLoggedIn){
        const cartLength = req.user.getCartLength();
        res.render('index',{products,title : 'Index Page',isAuth : req.session.user,cartLength : cartLength});
    }
    else{
        res.render('index',{products,title : 'Index Page',isAuth : req.session.user});
    }
};


export const getCart = async (req,res) => {

    
    await req.user.checkForDeletetedProducts();
    const cartLength = req.user.getCartLength();
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            res.render('cart',{title : 'Cart',products : user.cart.items,isAuth : req.session.user,cartLength : cartLength});
        })
        .catch(err => console.log(err));
};


export const get500 = (req,res,next) => {
    res.status(500).render('500',{title : '500 error'});
}