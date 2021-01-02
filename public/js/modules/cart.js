export async function addToCart() {
    
    let buttons = document.querySelectorAll("[class^='addToCart']");
    //let count = await getCartLength();
    //console.log(count);
    buttons.forEach(butt => {
        butt.addEventListener('click',(e) => {
            let id = butt.className.replace(/^\D+/g,'');
            let divVar ="productDiv"+id;
            const targetDiv =document.querySelector('.'+divVar);
            
            const title = targetDiv.querySelector('h3').textContent;
            const desc = targetDiv.querySelector('p').textContent;
            const price = targetDiv.querySelector('p').textContent;
            let img = targetDiv.querySelector('img').src;
            img = img.split('/uploads/')[1];
            let obj = {title,desc,price,image : img};
            
            //let span = document.querySelector("#cartSpan");
            //span.innerHTML = ++count;
            
            
            sendCartData(obj);

        });
    });
}

async function sendCartData(obj) {
    const rawResponse = await fetch('http://localhost:9000/shop/addtoCart',{
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(obj)
    });

    const content = await rawResponse.json();

    console.log(content);
}
