import express from 'express';
import {getProduct,addtoCart,addOrder,orderView,getCartLength,deleteProductFromCart,getInvoice} from '../controllers/shopController.js';
import isAuth from '../helpers/is-auth.js';
export const router = express.Router();



router.get('/product/:id',getProduct);

router.post('/addtoCart',isAuth,addtoCart);

router.get('/getCartLength',isAuth,getCartLength);

router.post('/deleteProduct/:productId',deleteProductFromCart);

router.post('/order',isAuth,addOrder);

router.get('/orderView',isAuth,orderView);

router.get('/orders/:orderId', isAuth,getInvoice);