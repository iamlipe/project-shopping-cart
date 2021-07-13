let total = 0;
const totalCart = 'total-cart';
const itemCart = 'item-cart';
const boxCount = document.createElement('div');
const count = document.createElement('p');

// salva todos os itens no localstorage
function saveList() {
  localStorage.setItem(itemCart, document.getElementById('cart__items').innerHTML);
  localStorage.setItem(totalCart, document.getElementById('totalPayment').innerHTML);
}

// carrega todos itens salvos no localstorage
function loadList() {
  if (localStorage.getItem(itemCart)) {
    document.getElementById('cart__items').innerHTML = localStorage.getItem(itemCart);
  }
  if (localStorage.getItem(totalCart)) {
    document.getElementById('totalPayment').innerHTML = localStorage.getItem(totalCart);
    total = parseFloat(document.getElementById('totalPayment').innerHTML);
  }
}

// calcula valor total do carrinho
function createTotalPayment(value = 0) {
  total += value;
  if (total > 1) {
    document.getElementById('totalPayment').innerText = total;
  } else {
    document.getElementById('totalPayment').innerText = '';
  }
  saveList();
}

// elemento imagem do shopping
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// elemento texto/button do shopping
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// cria os o elemento que ira conter no shopping
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const items = document.getElementById('items');
  section.className = 'item';
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho'));
  items.appendChild(section);
}

// remove o item selecionado no carrinho
function cartItemClickListener(event) {
  const cartItems = document.getElementById('cart__items');
  cartItems.removeChild(event.target.parentElement.parentElement);
  createTotalPayment(-parseFloat(event.target.parentElement.parentElement.children[1].innerText.slice(-11).split('$')[1]));
  countCart();
  saveList();
}

// cria os o elemento que ira conter no carrinho
function createCartItemElement({ title: name, price: salePrice }) {
  const li = document.createElement('li');
  const title = document.createElement('p');
  const price = document.createElement('p');
  const boxExcludeItem = document.createElement('div')
  const btnExcludeImg = document.createElement('img');
  const btnExcludeText =  document.createElement('p');
  li.className = 'cart__item';
  title.innerText = name;
  title.className = 'title__cart__item'
  price.innerText = `R$ ${salePrice}`;
  price.className = 'price__cart__item'
  boxExcludeItem.className = 'box__exclude__cart__item'
  btnExcludeImg.className = 'image__exclude__cart__item'
  btnExcludeImg.src = '../src/9699945831553239397.svg'
  btnExcludeText.innerText = 'excluir'
  boxExcludeItem.appendChild(btnExcludeImg);
  boxExcludeItem.appendChild(btnExcludeText);
  boxExcludeItem.addEventListener('click', cartItemClickListener);
  li.appendChild(title);
  li.appendChild(price);
  li.appendChild(boxExcludeItem);
  document.getElementById('cart__items').appendChild(li);
  countCart()
  saveList();
}

// consulta a api usando como parametro o item selecionado no carrinho
async function getCarItem(sku) {
  const result = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await result.json();
  try {
    createCartItemElement(data);
    createTotalPayment(data.price);
  } catch (error) {
    alert('Deu ruim!');
  }
}

// extrai o id do item clicado no carrinho
function getSkuFromProductItem(item) {
  const itemSku = item.querySelector('span.item__sku');
  return itemSku.innerText;
}

// seleciona o item clicado no carrinho
function getItemSeleted() {
  const addItem = document.querySelectorAll('.item__add');
  addItem.forEach((item) => 
    item.addEventListener('click', function () {
      getCarItem(getSkuFromProductItem(item.parentElement));
  }));
}

// cria addEventListen para os itens já carregados pelo localStorage
function addEventListenListLoaded() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((i) => 
    i.addEventListener('click', cartItemClickListener));
}

// remove todos os items no carrinho
function getEmptyCart() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((a) => a.parentElement.removeChild(a));
  total = 0;
  createTotalPayment();
  countCart()
  saveList();
}

function removeItemsShop() {
  document.querySelectorAll('.item').forEach((a) => document.getElementById('items').removeChild(a))
}


// faz a consulta da api
async function getProducts(query, order) {
  const loading = document.getElementById('loading');
  removeItemsShop()
  loading.style.display = 'flex'
  localStorage.setItem('query', query);
  let response;
  if (order !== '') {
    response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}&sort=${order}`);
  } else {
    response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}&sort=relevance`);
  }
  const data = await response.json();  
  try {
    loading.style.display = 'none'
    data.results.forEach((i) => createProductItemElement(i)); //                           Chama função passando o results como paramento
    getItemSeleted(); //                                                                   seleciona o id do produto selecionado
  } catch (error) {
    console.log(error);
  }
}

function countCart() {
  if (document.getElementById('cart__items').children.length > 0) {
    boxCount.style.display = 'flex'
    boxCount.className = 'box-count';
    count.className = 'count';
    count.innerHTML = document.getElementById('cart__items').children.length;
    boxCount.appendChild(count);
    document.getElementById('search').appendChild(boxCount);
  } else {
    boxCount.style.display = 'none';
  }
}

function getQuery() {
  if (document.getElementById('search-input').value === '') {
    getProducts('computador')
  } else {
    getProducts(document.getElementById('search-input').value);
  }
}

function getQueryOrder(event) {
  getProducts(localStorage.getItem('query'), event);
}

window.addEventListener('load', function() {
  getQuery();
  document.getElementById('search-image').addEventListener('click', getQuery);
  loadList();
  addEventListenListLoaded();
  document.getElementById('empty-cart').addEventListener('click', getEmptyCart);
  countCart()
})
