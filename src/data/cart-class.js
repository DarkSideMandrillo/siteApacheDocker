class Cart {
  cartItems;
  #localStorageKey; // private propriety

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() { // shortcut di "nome: function(){}""
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));

    if (!this.cartItems) {
      this.cartItems = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }];
    }
  }
  // Salvo il carrello in localstorage
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }
  //  Cerca un productId dentro Cart e ritorna tutto l'oggetto del carrello
  getProductCart(productId) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    return matchingItem;
  }
  // Controllo se esiste già un ID in cart[], se si incremento q.ta, altrimenti aggiungo 1
  addToCart(productId, quantity = 1) {
    const matchingItem = this.getProductCart(productId);

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionsId: '1'
      })
    }

    this.saveToStorage();
  }
  // Rimuovo da cart
  removeFromCart(produIdToRemove) {
    const index = this.cartItems.findIndex((item) => item.productId === produIdToRemove);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
    this.saveToStorage();
  }
  // Aggiungo il deliveryOptionId all'oggetto che matcha
  updateDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = this.getProductCart(productId);
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
  clear() {
    this.cartItems = [];
    this.saveToStorage();
  }
}



export let cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

//cart.#localStorageKey ='test'; //error

//-----------------------------------//
export let products = [];
export function loadCart(fun = () => { }) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {

    console.log(xhr.response);
    fun();
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

