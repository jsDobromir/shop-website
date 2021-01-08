export async function addToCart() {
    
    let buttons = document.querySelectorAll("[class^='addToCart']");
    //let count = await getCartLength();
    //console.log(count);
    buttons.forEach(butt => {
        butt.addEventListener('click',(e) => {
            let id = butt.className.replace(/^\D+/g,'');
            let divVar ="productDiv"+id;
            const targetDiv =document.querySelector('.'+divVar);

            let atag = targetDiv.querySelector(".buttonsDiv").querySelector("a").getAttribute("href");

            let userId = atag.split("/")[3];

            alert(userId);
            
            // const title = targetDiv.querySelector('h3').textContent;
            // const desc = targetDiv.querySelector('#descP').textContent;
            // const price = targetDiv.querySelector('#priceP').textContent;
            // let img = targetDiv.querySelector('img').src;
            // img = img.split('/uploads/')[1];
            // let obj = {title,desc,price,image : img};
            // console.log(obj);
            //let span = document.querySelector("#cartSpan");
            //span.innerHTML = ++count;
            
            
            sendCartData({userId : userId});

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
}

export async function getCartLength(){

    const rawResponse = await fetch('http://localhost:9000/shop/getCartLength',{
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
    });

    const jsonResp = await rawResponse.json();

    if(jsonResp.quantity>0){
        let span = document.querySelector("#cartSpan");
        span.innerHTML = jsonResp.quantity;
    }
};