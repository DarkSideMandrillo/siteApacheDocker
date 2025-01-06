import { orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import formatCurrency from "./utils/money.js";

try {
  await loadProductsFetch();
  resolve();
} catch (error) { console.log(`unexpected error. please try again ${error}`); }

renderOrdersGrid()

//loadProducts(renderOrdersGrid);

function renderOrdersGrid() {
  let ordersHTML = ``;
  // Per ogni ordine creo l'heder
  orders.forEach((order) => {
    ordersHTML += `
    <div class="order-container">

    <div class="order-header">
      <div class="order-header-left-section">
        <div class="order-date">
          <div class="order-header-label">Order Placed:</div>
          <div>${order.orderTime}</div>
        </div>
        <div class="order-total">
          <div class="order-header-label">Total:</div>
          <div>$${formatCurrency(order.totalCostCents)}</div>
        </div>
      </div>

      <div class="order-header-right-section">
        <div class="order-header-label">Order ID:</div>
        <div>${order.id}</div>
      </div>
    </div>

    <div class="order-details-grid js-order-details-grid${order.id}">
    </div>

  </div>
  `
  });

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  // Popolo la griglia di ogni ordine con i products
  orders.forEach((order) => {
    let orderHTML = '';
    order.products.forEach((orderProduct) => {
      const product = getProduct(orderProduct.productId);
      orderHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${orderProduct.estimatedDeliveryTime}
        </div>
        <div class="product-quantity">
          Quantity: ${orderProduct.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
      `
    })
    console.log(order.id);
    document.querySelector(`.js-order-details-grid${order.id}`).innerHTML = orderHTML;
  })


}