let cart = [];
const selectedSizes = {};
const selectedPrices = {};


document.addEventListener('DOMContentLoaded', () => {
  // Select all product containers
  const productBlocks = document.querySelectorAll('.product__card');

  productBlocks.forEach(block => {
    const album = block.querySelector('.product__album');
    const images = album ? album.querySelectorAll('.thumb') : [];
    const prevBtn = block.querySelector('.nav-arrow.prev');
    const nextBtn = block.querySelector('.nav-arrow.next');

    if (!album || images.length === 0) return;

    let currentIndex = 0;

    function showImage(index) {
      images.forEach((img, i) => {
        img.style.display = (i === index) ? 'block' : 'none';
      });
    }

    showImage(currentIndex);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    }
  });
});



function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
}

function selectSize(productId, price, button) {
  selectedSizes[productId] = button.textContent.split(' - ')[0];
  selectedPrices[productId] = price;

  const buttons = document.querySelectorAll(`#${productId}-buttons .size-button`);
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function openCart() {
  const overlay = document.getElementById('cartOverlay');
  const panel = document.querySelector('.cart-panel');
  if (overlay && panel) {
    overlay.style.display = 'block';
    panel.classList.add('open');
    updateCartDisplay();
  }
}

function closeCart() {
  const overlay = document.getElementById('cartOverlay');
  const panel = document.querySelector('.cart-panel');
  if (overlay && panel) {
    overlay.style.display = 'none';
    panel.classList.remove('open');
  }
}

function updateCartDisplay() {
  const cartContent = document.querySelector('.cart-content');
  const checkoutBtn = document.querySelector('.checkout-btn-mini');

  if (!cartContent) return; // Prevent error on non-cart pages

  cartContent.innerHTML = '';

  if (cart.length === 0) {
    cartContent.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.5";
    }
    return;
  }

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item-mini');
    itemEl.innerHTML = `
      <div class="item-info">
        <h4>${item.name} (${item.size})</h4>
        <p>${item.quantity} pcs</p>
      </div>
      <div class="item-price-qty">
        <div class="price">${formatCurrency(item.price * item.quantity)}</div>
        <div class="qty">${formatCurrency(item.price)} x ${item.quantity}</div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}', '${item.size}')">Remove</button>
      </div>
    `;
    cartContent.appendChild(itemEl);
  });

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
  }
}

function removeFromCart(productId, size) {
  const index = cart.findIndex(item => item.id === productId && item.size === size);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    updateCartCount();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  if (Array.isArray(savedCart)) {
    cart = savedCart;
    updateCartCount();
    updateCartDisplay();
  }
}

function updateCartCount() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = totalCount;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Only run this if "add-to-cart" buttons exist (e.g., on products page)
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const productName = button.dataset.name;
      const price = selectedPrices[productId];
      const size = selectedSizes[productId];

      if (!price || !size) {
        alert("Please select a size before adding to cart.");
        return;
      }

      const existing = cart.find(item => item.id === productId && item.size === size);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id: productId, name: productName, price, size, quantity: 1 });
      }

      saveCart();
      updateCartCount();
      updateCartDisplay();
      openCart();
    });
  });

  loadCart();
});
