import path from 'path';
import {__dirname} from '../helpers/pathHelper.js';
import fs from 'fs';

const p = path.join(__dirname,'data','products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  };

export default class Product {

    constructor(title,desc,price,image){
        this.title = title;
        this.desc = desc;
        this.price = price;
        this.image = image;
    }

    save(){
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                if(err){
                    console.log(err);
                }
            });
        })
    }

    static getProductById(id,cb){
      fs.readFile(p,(err,fileContent) => {
        if(err){
          cb([]);
        }
        let products = JSON.parse(fileContent);
        products.forEach(prod => {
          if(prod.id===id){
            cb(prod);
          }
        });
      });
    }

    static deleteProduct(id,cb) {
      fs.readFile(p,(err,fileContent) => {
        if(err){
          cb(undefined);
        }
        let products = JSON.parse(fileContent);
        
        products = products.filter(prod => prod.id!==id);

        fs.writeFile(p,JSON.stringify(products),(err) => {
          if(err){
            cb(undefined);
          }
          cb(products);
        });
      });
    }

    static async fetchAll(cb){
        getProductsFromFile(cb);
    }

    static async editProduct(prod,productObj,cb){
      fs.readFile(p, (err, fileContent) => {
        if (err) {
          cb([]);
        } else {
          let data = JSON.parse(fileContent);
          data.forEach(product => {
            if(product.title===prod){
              console.log(`product found ${product.title}`);
              product.title = prod;
            }
          });
          fs.writeFile(p,JSON.stringify(data),(err) => {
            if(err){
              cb([]);
            }
            cb(data);
          })
        }
      });
    }
}