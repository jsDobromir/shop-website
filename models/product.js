import mongodb  from 'mongodb';
import {mongoConnect,getDb}  from '../helpers/database.js';


export default class Product {

  constructor(title,price,description,imageUrl,id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id){
      //update
      dbOp = db.collection('products').updateOne({_id : this._id},{$set : this});
    }
    else{
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp;
  }

  static fetchAll(callback){
    const db = getDb();
    return new Promise((resolve,reject) => {
      db.collection('products')
      .find()
      .toArray()
      .then(products => {
        resolve(products);
      })
      .catch(err => {
        reject(err);
      })
    });
  }

  static getProductById(id) {
    const db = getDb();
    console.log(id);
    const searchingId = new mongodb.ObjectId(id);
    return db.collection('products')
      .find({_id : searchingId})
      .next()
  }

  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({_id : new mongodb.ObjectId(prodId)});
  }
}