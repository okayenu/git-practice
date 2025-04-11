export let cart;

loadFromLocalStorage();

export function loadFromLocalStorage() {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  cart = savedCart || [
    { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryOptionId: '1' },
    { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1, deliveryOptionId: '2' }
  ];
}

export function getCartQuantity() {
  let quantity = 0;
  cart.forEach((item) => {
    quantity += item.quantity;
  });
  return quantity;
}



export function addToCart(productId, quantity = 1) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }
  saveToStorage();
}


function saveToStorage()
{
  localStorage.setItem('cart',JSON.stringify(cart))
}


export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}


export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((item) => {
    if (item.productId === productId) {
      matchingItem = item;
    }
  });
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}


export function loadCart(fun)
{
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load',()=>
  {
    console.log(xhr.response);
    fun();
  });

  xhr.open('GET','https://supersimplebackend.dev/cart' );
  xhr.send();
}


