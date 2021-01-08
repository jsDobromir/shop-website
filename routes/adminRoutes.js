import express from 'express';
import {renderProducts,postProduct,upload,resize,manageProductsView,editProduct,editProductPost,deleteProduct} from '../controllers/productController.js';
//import {productValidationRules,validate} from '../helpers/validator.js';
export const router = express.Router();

router.route('/products')
    .get(renderProducts)
    .post(upload,resize,postProduct);

router.route('/manageproducts')
    .get(manageProductsView);

router.get('/editproduct/:productId',editProduct)
    .post('/editproduct/:productId',editProductPost);

router.post('/deleteproduct/:id',deleteProduct);