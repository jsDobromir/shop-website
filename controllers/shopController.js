import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const getProduct = (req,res,next) => {
    let id = req.params.id;
    Product.getProductById(id)
        .then(product => {
            res.render('shop/product',{title : `${product.title}`,product});
        })
        .catch(err => {
            console.log(err);
        });
};

export const addtoCart = (req,res,next) => {
    //console.log(`coming data ${req.body}`);
    
    // const product = new Product(title,price,desc,img);
    // product.save();
    Product.getProductById(req.body.userId).then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(`added to cart ${result}`);
    });
};

export const getCartLength = async (req,res,next) => {
    
    let quantity = req.user.getQuantity();

    res.json({quantity : quantity});

};

export const deleteProductFromCart = (req,res,next) => {

    req.user.deleteProductFromCart(req.params.productId)
        .then(cart => {
            res.redirect('../../cart');
        })
        .catch(err => {
            console.log(err);
        });
};

export const addOrder = (req,res) => {

    req.user.addOrder()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};

export const orderView = (req,res) => {
    
    req.user.getOrders()
        .then(result => {
            if(typeof result !=='undefined' && result.length>0){
                const orders = [];
                result.forEach(order => {
                    orders.push(order.items);
                });
                console.log(orders);
                res.render('order',{title : `${req.user.getName()}`,orders : orders});
            }
            else{
                res.render('order',{title : `${req.user.getName()} orders`,name : req.user.getName()})
            }
            // if(result){
                
            //     res.render('order',{title : `${req.user.getName()} orders`,products : result.items});
            // }
            // else{
            //     res.render('order',{title : `${req.user.getName()} orders`})
            // }
        })
        .catch(err => {
            console.log(err);
        })

}