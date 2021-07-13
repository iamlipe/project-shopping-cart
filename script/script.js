const bag = document.getElementById('bag');
const modal =  document.getElementById('modal');
const closeModalButton =  document.getElementById('close-cart-button');

function openBag(event) {
  if (modal.classList.contains('closed')) {
    modal.classList.remove('closed');
    document.body.style.overflow = 'hidden'
  }
  if (event.target.id === 'modal' || event.target.id === 'close-cart-button' ) {
    modal.classList.add('closed');
    document.body.style.overflow = 'auto'
  }
} 

bag.addEventListener('click', openBag);
modal.addEventListener('click', openBag);
closeModalButton.addEventListener('click', openBag);
