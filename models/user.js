import mongodb from 'mongodb';
import {getDb}  from '../helpers/database.js';

export default class User {

    constructor(username,email,cart,id){
        this.name = username;
        this.email = email;
        this.cart = cart; // {items : []}
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    getName() {
        return this.name;
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        console.log(`found index ${cartProductIndex}`);
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if(cartProductIndex>=0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }else {
            updatedCartItems.push({
                productId : new mongodb.ObjectId(product._id),
                quantity : newQuantity
            });
        }
        const updatedCart = {
            items : updatedCartItems
        };
        //const updatedCart = {items : [{productId : new mongodb.ObjectId(product._id), quantity: newQuantity}] };
        const db = getDb();
        return db.collection('users').updateOne({_id : new mongodb.ObjectId(this._id)},{$set : {cart : updatedCart}});
    }

    checkProductDeleted(productId,productsFromDb){
        productsFromDb.forEach(product => {
            if(product._id.toString()=== productId.toString()){
                console.log(`found ${productId}`);
                return true;
            }
        });
        return false;
    }
 
    async getCart(){
        const db =getDb();
        const productsIds = this.cart.items.map(prod => prod.productId);

        console.log(`productsIds : ${productsIds}`);

        let productsFromDb = await db.collection('products').find({_id : {$in : productsIds}}).toArray();

        productsIds.forEach(async prodId => {
            if(!this.checkProductDeleted(prodId,productsFromDb)) {
                //delete this product from db
                const updatedCartItems = this.cart.items.filter(item => {
                    return item.productId.toString()!==prodId.toString();
                });
                await db.collection('users')
                    .updateOne(
                        {_id : new mongodb.ObjectId(this._id)},
                        {$set : {cart : {items : updatedCartItems}}}
                    );        
            }
        });

        return db.collection('products').find({_id: {$in: productsIds}}).toArray()
            .then(products => {
                return products.map(p => {
                    return {...p, quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString();
                    }).quantity};
                })
            });
    }

    getQuantity(){
        const db = getDb();
        let total = 0;
        this.cart.items.forEach(item => {
            total +=item.quantity;
        })
        return total;
    }

    deleteProductFromCart(productId){
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        return db.collection('users')
            .updateOne(
                {_id : new mongodb.ObjectId(this._id)},
                {$set : {cart : {items : updatedCartItems}}}
            );
    }

    addOrder(){
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items : products,
                user : {
                    _id : new mongodb.ObjectId(this._id),
                    name : this.name
                }
            };
            return db.collection('orders').insertOne(order);
        })
        .then(result => {
            this.cart = {items : []};
            return db.collection('users')
                .updateOne(
                    {_id : new mongodb.ObjectId(this._id)},
                    {$set : {cart : {items : []}}}
                );
        });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({'user._id' : new mongodb.ObjectId(this._id)}).toArray();
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id : new mongodb.ObjectId(userId)}).next();
    }
}