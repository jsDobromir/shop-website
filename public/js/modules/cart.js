export async function addToCart() {
    
    let buttons = document.querySelectorAll("[class^='addToCart']");
    buttons.forEach(butt => {
        butt.addEventListener('click',async (e) => {
            let id = butt.className.replace(/^\D+/g,'');
            let divVar ="productDiv"+id;
            const targetDiv =document.querySelector('.'+divVar);

            let atag = targetDiv.querySelector(".buttonsDiv").querySelector("a").getAttribute("href");

            let hiddenValue = targetDiv.querySelector("#hidden").value;

            let userId = atag.split("/")[3];

            let ans = await getLengthOnIncrement();
            console.log(ans);
            let span = document.querySelector("#cartSpan");
            span.innerHTML = ++ans;
            
            
            alert(userId);
            
            
            sendCartData({userId : userId, _csrf : hiddenValue});

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

const getLengthOnIncrement = async () => {

    let rawResponse = await fetch('http://localhost:9000/shop/getCartLength',{
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
    });

    let jsonResponse = await rawResponse.json();
    let quant = jsonResponse.quantity;
    return quant;
}

// export async function getCartLength(){

//     fetch('http://localhost:9000/shop/getCartLength',{
//         headers : { 
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//            }
//     })
//     .then(rawResponse => {
//         return rawResponse.json();
//     })
//     .then(jsonResp => {
//         console.log(jsonResp);
//         if(jsonResp.quantity===0){
//             let span = document.querySelector("#cartSpan");
//             span.innerHTML = 'No items in cart';
//         }
//         else if(jsonResp.quantity>0){
//             let span = document.querySelector("#cartSpan");
//             span.innerHTML = jsonResp.quantity;
//         }
//     })
//     .catch(err => {
//         console.log(err);
//     });
// };