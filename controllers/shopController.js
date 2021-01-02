import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const getProduct = (req,res,next) => {
    let id = req.params.id;
    Product.getProductById(id,product => {
        console.log(product);
        res.render('shop/product',{title : `${product.title}`,product});
    });
};

export const addtoCart = (req,res,next) => {
    console.log(`coming data ${req.body}`);
    let id = req.body.id;
    let price = req.body.price;
    Cart.addProduct(id,price);
};
