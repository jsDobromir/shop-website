import Cart from "../models/cart.js";
import {Product} from "../models/product.js";
import {Order} from "../models/order.js";
import {User} from "../models/user.js";
import fs from 'fs';
import path from 'path';
import {__dirname} from '../helpers/pathHelper.js';

export const getProduct = (req,res,next) => {
    let id = req.params.id;
    Product.findById(id)
        .then(product => {
            res.render('shop/product',{title : `${product.title}`,product,isAuth : req.session.user});
        })
        .catch(err => {
            console.log(err);
        });
};

export const addtoCart = (req,res,next) => {
    //console.log(`coming data ${req.body}`);
    
    // const product = new Product(title,price,desc,img);
    // product.save();
    Product.findById(req.body.userId).then(product => {
        
        return req.user.addToCart(product);
            
    })
    .then(result => {
        console.log(`added to cart ${result}`);
    })
    .catch(err => {
        console.log(err);
    }) 
};

export const getCartLength = async (req,res,next) => {
        console.log('here in getCartLength');
        let quantity = req.user.getCartLength();
    
        res.json({quantity : quantity});

};

export const deleteProductFromCart = (req,res,next) => {

    
        req.user.deleteProductFromCart(req.params.productId)
            .then(cart => {
                res.redirect('../../cart');
            })
            .catch(err => {
                console.log(err);
            })
};

export const addOrder = (req,res) => {

    
        req.user.addOrder()
            .then(result => {
                res.redirect('/');
            })
        .catch(err => {
            console.log(`Error fetching user at addOrder : ${err}`);
        })
};

export const orderView = (req,res) => {
    

    Order.find({user : req.user._id}).populate('items.productId').exec()
        .then(result => {
            console.log(result);
            if(typeof result !=='undefined' && result.length>0){
                const orders = [];
                result.forEach(order => {
                    orders.push({id : order._id,items : order.items});
                });
                res.render('order',{title : `Your orders`,orders : orders,isAuth : req.session.user});
            }
            else{
                res.render('order',{title : `Your orders`,isAuth : req.session.user});
            }

        })
        .catch(err => {
            console.log(`Error fetching orders : ${err}`);
        })

    // req.user.getOrders()
    //     .then(result => {
    //         if(typeof result !=='undefined' && result.length>0){
    //             const orders = [];
    //             result.forEach(order => {
    //                 orders.push(order.items);
    //             });
    //             console.log(orders);
    //             res.render('order',{title : `${req.user.getName()}`,orders : orders});
    //         }
    //         else{
    //             res.render('order',{title : `${req.user.getName()} orders`,name : req.user.getName()})
    //         }


}

export const getInvoice = (req,res,next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if(!order){
                console.log('coming here');
                return next(new Error('No order found'));
            }
            if(order.user.toString() !== req.user._id.toString()){
                return next(new Error('Unauthorized'));
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join(__dirname,'data','invoices',invoiceName);
            // fs.readFile(invoicePath, (err,data) => {
            //     if(err){
            //         return next(err);
            //     }

            //     res.setHeader('Content-Type','application/pdf');
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName +'"');
            //     res.send(data);

            // });
            const file = fs.createReadStream(invoicePath);
            res.setHeader('Content-Type','application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName +'"');
            file.pipe(res);
        })
        .catch(err => {
            return next(err);
        });
};