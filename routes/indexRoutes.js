import express from 'express';
import {renderShop,getCart,get500} from '../controllers/indexController.js';
import isAuth from '../helpers/is-auth.js';
export const router = express.Router();

router.get('/',renderShop);

router.get('/cart',isAuth,getCart);

router.get('/500',get500);