import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    items : [
        {
            productId : {type : mongoose.Schema.Types.ObjectId,ref : 'Product',required : true},
            quantity : {type : Number,quantity : true}
        }    
    ],

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }

});


export const Order = mongoose.model('Order',orderSchema);