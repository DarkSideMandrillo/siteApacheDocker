import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummery.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart-class.js";
//import '../data/cart-class.js';

async function loadPage() {
    try {
        //  throw 'error1'; // manualy create error
        await loadProductsFetch(); // possiamo usare await sono nelle async func

        const value = await new Promise((resolve, reject) => { // Await funziona solo con un return promise (loadProductsFetch usa fetch e ritorna)
            //  throw 'error2'; // await diventa sincronis
            loadCart(() => { // Come loadProducts
                //  reject('error3'); per creare errori async
                resolve('value'); // non serve nulla, ma in questo caso non va sul then ma è un return
            });
        })
        //  function prova(){await loadProductsFetch();} // Await così non funziona

    } catch (error) { console.log(`unexpected error. please try again ${error}`); }

    renderOrderSummary();
    renderPaymentSummary();

}
loadPage();


/* // Uso Promise.all
Promise.all([//Crea 2 thread eseguiti nello stesso momento
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => { // Come loadProducts
            resolve();
        });
    })

]).then((value) => {
    console.log(value);
    renderOrderSummary();
    renderPaymentSummary();
});
*/

// Uso diversi promise
// new Promise((resolve) => { //Crea thread
//     loadProducts(() => { // ricordiamo che loadproducts chiede il passaggio di una func e la esegue alla fine
//         resolve('value1'); // Il resolve richiama il .then
//     });

// }).then((value) => {
//     console.log(value);
//     return new Promise((resolve) => {
//         loadCart(() => { // Come loadProducts
//             resolve();
//         });
//     });

// }).then(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
// });

/* Uso i callback
// loadProducts(() => {
//     loadCart(() => {
//         renderOrderSummary();
//         renderPaymentSummary();
//     });
// }); //callback. Puo causare un multiply of nesting come nell'esempio
*/

