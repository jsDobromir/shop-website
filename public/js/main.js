import {addToCart,getCartLength} from './modules/cart.js';

window.addEventListener('DOMContentLoaded', (event) => {

    getCartLength();
    addToCart();

});