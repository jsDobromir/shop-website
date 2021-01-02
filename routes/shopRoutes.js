import express from 'express';
import {getProduct,addtoCart} from '../controllers/shopController.js';
export const router = express.Router();



router.get('/product/:id',getProduct);

router.post('/addtoCart',addtoCart);
