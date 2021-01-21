import express from 'express';
import {renderProducts,postProduct,manageProductsView,editProduct,editProductPost,deleteProduct} from '../controllers/productController.js';
//import {productValidationRules,validate} from '../helpers/validator.js';
import expValidator from 'express-validator';
const {check,body} = expValidator;
export const router = express.Router();

router.get('/products',renderProducts);
    
router.post('/products',

        [
            body('title').trim().isLength({min : 3}).withMessage('Title should be at least 3 characters'),
            body('price').isFloat('Price should contain only digits'),
            body('desc').isLength({min: 5,max: 400}).withMessage('Description should be between 5 and 400 characters'),
        ],

    postProduct);

router.route('/manageproducts')
    .get(manageProductsView);

router.get('/editproduct/:productId',editProduct);
router.post('/editproduct/:productId',
[
    body('title').trim().isLength({min : 3}).withMessage('Title should be at least 3 characters'),
    body('price').isFloat('Price should contain only digits'),
    body('desc').isLength({min: 5,max: 400}).withMessage('Description should be between 5 and 400 characters'),
],
editProductPost);

router.post('/deleteproduct/:id',deleteProduct);