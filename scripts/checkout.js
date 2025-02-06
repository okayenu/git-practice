import {cart, removeFromCart, updateDeliveryOPtion} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js';



function renderOrderSummary()
{
  let cartHTMLSummary = '';
  cart.forEach((item)=>
    {
    
        const productId = item.productId;
        let matchingItem;
    
        products.forEach((product)=>
        {
            if(product.id === productId)
            {
                matchingItem = product;
            }
        });
    
    
        const deliveryOptionId = item.deliveryOptionId;
    
        let deliveryOption;
    
        deliveryOptions.forEach((option)=>
        {
            if(option.id === deliveryOptionId)
            {
              deliveryOption = option;
            }
        });
    
        const today = dayjs();
        const deliveryDate = today.add(
          deliveryOption.deliveryDays, 'days'
        );
    
        const deliveryString = deliveryDate.format(
          'dddd, MMMM D'
        );
    
    
    
    
        cartHTMLSummary+=`<div class="cart-item-container
          js-item-container-${matchingItem.id}">
                <div class="delivery-date">
                  Delivery date: ${deliveryString}
                </div>
    
                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingItem.image}">
    
                  <div class="cart-item-details">
                    <div class="product-name">
                      ${matchingItem.name}
                    </div>
                    <div class="product-price">
                      $${formatCurrency(matchingItem.priceCents)}
                    </div>
                    <div class="product-quantity">
                      <span>
                        Quantity: <span class="quantity-label">${item.quantity}</span>
                      </span>
                      <span class="update-quantity-link link-primary">
                        Update
                      </span>
                      <span data-product-id="${matchingItem.id}" class="delete-quantity-link link-primary js-delete-link">
                        Delete
                      </span>
                    </div>
                  </div>
    
                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                      ${deliveryOptionsHTML(matchingItem,item)}
                  </div>
                </div>
              </div>`;
        
    
    });
    
    //console.log(cartHTMLSummary);
    
    function deliveryOptionsHTML(matchingItem,item)
    {
      let html ='';
      const today = dayjs();
    
     
      deliveryOptions.forEach((deliveryOption)=>
      {
        const isChecked = deliveryOption.id === item.deliveryOptionId;
        const deliveryDate = today.add(
          deliveryOption.deliveryDays, 'days'
        );
    
        const deliveryString = deliveryDate.format(
          'dddd, MMMM D'
        );
    
        const priceString = deliveryOption.priceCents === 0? 'FREE':
          `$${formatCurrency(deliveryOption.priceCents)}-`;
    
        html+=`
          <div class="delivery-option js-delivery-option"
           data-product-id="${matchingItem.id}"
           data-delivery-option-id=${deliveryOption.id}>
                <input type="radio" ${isChecked?'checked':''}
                  class="delivery-option-input"
                  name="delivery-option-${matchingItem.id}">
                <div>
                  <div class="delivery-option-date">
                    ${deliveryString}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString} Shipping
                  </div>
                </div>
              </div>
          
          `;
      })
    
      return html;
    }
    
    document.querySelector('.js-page').innerHTML = cartHTMLSummary;
    
    document.querySelectorAll('.js-delete-link').forEach(
      (link)=>
      {
        link.addEventListener('click',()=>
        {
          const {productId} = link.dataset;
          removeFromCart(productId);
          
          const container = document.querySelector(`.js-item-container-${productId}`);
    
          container.remove();
    
          console.log(cart);
          
        })
      }
    );
    
    document.querySelectorAll('.js-delivery-option').forEach
    ((element)=>
        {
          const {productId, deliveryOptionId}= element.dataset;
          element.addEventListener('click',()=>
          {
            updateDeliveryOPtion(productId,deliveryOptionId);
            renderOrderSummary();
          })
        });

}

renderOrderSummary();

