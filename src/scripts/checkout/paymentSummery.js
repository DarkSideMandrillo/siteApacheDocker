import { cart } from "../../data/cart-class.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId || '1');
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div class="js-payment-summary-item-number">Items (3):</div>
        <div class="payment-summary-money">
          $${formatCurrency(productPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$
          ${formatCurrency(shippingPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$
          ${formatCurrency(totalBeforeTaxCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$
          ${formatCurrency(taxCents)}
        </div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$
          ${formatCurrency(totalCents)}
        </div>
      </div>

      <button class="place-order-button button-primary js-place-order">
        Place your order
      </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order').addEventListener('click', async () => {
    try {
      const cartOrder = buildOrder(); // Creo l'ordine come lo vuole il backend

      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cartOrder
        })
      });
      const order = await response.json();
      addOrder(order);

      cart.clear();
      console.log('clear cart');
    } catch (error) {
      console.log('Unexpected error, try again later');
    }
    window.location.href = 'orders.html';


  });


  // Aggiornamento Q.ta visualizzate
  checkoutQuantity();

}

export function checkoutQuantity() {
  let cartQuantity = 0;
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  // Aggiorno il valore qta dell'header checkout
  document.querySelector('.js-checkout-header-quantity').innerHTML = cartQuantity;
  // Aggiorno il valore qta del carrello 
  document.querySelector('.js-payment-summary-item-number').innerHTML = `items (${cartQuantity})`;

}

function buildOrder() {
  const buildOrder = cart.cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    deliveryOptionId: item.deliveryOption
  }));
  return buildOrder;

}