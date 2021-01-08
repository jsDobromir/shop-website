import express from 'express';
import {getProduct,addtoCart,addOrder,orderView,getCartLength,deleteProductFromCart} from '../controllers/shopController.js';
export const router = express.Router();



router.get('/product/:id',getProduct);

router.post('/addtoCart',addtoCart);

router.get('/getCartLength',getCartLength);

router.post('/deleteProduct/:productId',deleteProductFromCart);

router.post('/order',addOrder);

router.get('/orderView',orderView);