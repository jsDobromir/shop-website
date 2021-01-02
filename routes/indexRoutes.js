import express from 'express';
import {renderShop,getCart} from '../controllers/indexController.js';
export const router = express.Router();

router.get('/',renderShop);

router.get('/cart',getCart);