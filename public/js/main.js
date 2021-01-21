import {addToCart} from './modules/cart.js';

window.addEventListener('DOMContentLoaded', (event) => {

    addToCart();

    checkForFlashMessages();

    checkForSuccessMessages();

});

function checkForFlashMessages(){
    
    let errorDivs = document.querySelectorAll('.errorMessage');

    setTimeout(() => {

        errorDivs.forEach(div => {
            div.parentNode.removeChild(div);
        });

    },5000);

}

function checkForSuccessMessages(){
    let succesDivs = document.querySelectorAll('.successMessage');

    setTimeout(() => {

        succesDivs.forEach(div => {
            div.parentNode.removeChild(div);
        });

    },5000);
}