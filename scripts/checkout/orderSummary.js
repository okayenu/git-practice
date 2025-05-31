import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  if (cart.length === 0) {
    document.querySelector('.js-order-summary').innerHTML = `
      <div class="empty-cart-message">
        Your cart is empty. <a class="link-primary" href="amazon.html">Continue shopping</a>
      </div>
    `;
    return;
  }

  let cartHTMLSummary = '';

  cart.forEach((item) => {
    const matchingItem = getProduct(item.productId);
    const deliveryOption = getDeliveryOption(item.deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const deliveryString = deliveryDate.format('dddd, MMMM D');

    cartHTMLSummary += `
      <div class="cart-item-container js-item-container js-item-container-${matchingItem.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingItem.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingItem.name}
            </div>
            <div class="product-price">
              ${matchingItem.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingItem.id}">
              <span>
                Quantity: <span class="quantity-label">${item.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary">Update</span>
              <span data-product-id="${matchingItem.id}"
                class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingItem.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingItem, item)}
          </div>
        </div>
      </div>`;
  });

  function deliveryOptionsHTML(matchingItem, item) {
    let html = '';
    const today = dayjs();

    deliveryOptions.forEach((deliveryOption) => {
      const isChecked = deliveryOption.id === item.deliveryOptionId;
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const deliveryString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}-`;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingItem.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">${deliveryString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>`;
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartHTMLSummary;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      removeFromCart(productId);
      document.querySelector(`.js-item-container-${productId}`).remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
