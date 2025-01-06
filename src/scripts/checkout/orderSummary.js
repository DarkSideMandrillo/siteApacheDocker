//import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { cart } from "../../data/cart-class.js";
import { getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary, checkoutQuantity } from "./paymentSummery.js";

export function renderOrderSummary() {

  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {

    const productId = cartItem.productId;
    // func in product.js
    const matchingProduct = getProduct(productId);

    // Prende dal carrello il deliveryOption, FUNC in DeliveryOption che ritorna l'oggetto completo
    const deliveryOptionId = cartItem.deliveryOptionId || '1';
    const deliveryOption = getDeliveryOption(deliveryOptionId);


    // Crea variabili per scrivere le date in base al deliveryOption
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    // calcolo la quantità totale del carrello

    cartSummaryHTML += `
  <div class="cart-item-container
  js-cart-item-container
  js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${dateString}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image" src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          ${(matchingProduct.getPrice(cartItem.quantity))}
        </div>
        <div class="product-quantity
        js-product-quantity-${matchingProduct.id}">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
       ${deliveryOptionsHTML(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
`;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}  -`;

      // Creo il check blu. Se non c'è cartItem.deliveryOptionId, scelgo l'opzione 1
      const isChecked = deliveryOption.id === (cartItem.deliveryOptionId || '1');

      html += `
    <div class="delivery-option js-delivery-option"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}"
    >
        <input type="radio" 
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input" 
        name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
    });

    return html;
  }



  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


  // Giro per ogni link "delete" creato. Event Listner
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productID = link.dataset.productId;
      cart.removeFromCart(productID);

      //  Prendo l'elemento usando DOM per cancellarlo
      const container = document.querySelector(
        `.js-cart-item-container-${productID}`)
      container.remove();

      checkoutQuantity()
      renderPaymentSummary();
    });
  });

  // RiRenderizzo la pagina ogni click su deliveryOption.  Event Listner
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    const { productId, deliveryOptionId } = element.dataset;
    element.addEventListener('click', () => {
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
