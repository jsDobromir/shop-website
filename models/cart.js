import fs from 'fs';
import path from 'path';
import {__dirname} from '../helpers/pathHelper.js';
const p = path.join(__dirname,'data','cart.json');

export default class Cart {


    static addProduct(id,productPrice){
        fs.readFile(p,(err,fileContent) => {
            
            let cart = {products : [],totalPrice : 0};
            
            if(!err){
                cart = JSON.parse(fileContent);
            }
            //Analyze the cart
            console.log(cart);
            const existingProductIndex = cart.products.findIndex(prod => prod.id===id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = existingProduct + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                updatedProduct = {id : id,qty : 1};
                cart.products = [...cart.products,updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err) => {
                console.log(err);
            });
        });
    }

    static getProductLength(cb){
        fs.readFile(p,(err,fileContent) => {
            if(!err){
                let data = JSON.parse(fileContent);
                if(data.length===0) cb(0);
                else cb(data.products.length);
            }
            
        });
    }

}