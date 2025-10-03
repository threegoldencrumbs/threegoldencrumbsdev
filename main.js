/* main.js
   Single JS file shared by all pages. Replace images & data below.
*/

/* -------------------------
   SAMPLE DATA - replace with your real flavors, photos, reviews
   prices are numbers (USD)
------------------------- */
const FLAVORS = [
  { id: 'chocolate-chip', name: 'Chocolate Chip', price: 18.00, img: 'images/choco.jpg', short: 'Classic chocolate chip' },
  { id: 'double-choco', name: 'Double Chocolate', price: 20.00, img: 'images/double.jpg', short: 'Rich double cocoa' },
  { id: 'white-mac', name: 'White Macadamia', price: 19.00, img: 'images/mac.jpg', short: 'White chocolate & macadamia' },
  { id: 'sugar', name: 'Sugar Cookie', price: 16.00, img: 'images/sugar.jpg', short: 'Soft sugar cookie' },
  // add more...
];

const PHOTOS = [
  'images/photo1.jpg','images/photo2.jpg','images/photo3.jpg','images/photo4.jpg'
];

const REVIEWS = [
  { author: 'Dana', text: 'Absolutely perfect — crisp edges, gooey center.' },
  { author: 'Asha', text: 'My go-to cookies for every party.' },
  { author: 'Miguel', text: 'Fantastic flavor and fast pickup.' },
];

/* -------------------------
   CART - stored in localStorage under key 'tgc_cart'
------------------------- */
const STORAGE_KEY = 'tgc_cart';

function loadCart(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}
function saveCart(cart){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/* add item to cart (qty is integer number of dozens default 1) */
function addToCart(itemId, qty=1){
  const cart = loadCart();
  const existing = cart.find(i=>i.id===itemId);
  if(existing){
    existing.qty += qty;
  } else {
    const flavor = FLAVORS.find(f=>f.id===itemId);
    if(!flavor) return;
    cart.push({ id:itemId, name:flavor.name, price:flavor.price, img:flavor.img, qty: qty });
  }
  saveCart(cart);
  renderCartUI();
}

/* update qty or remove if qty <=0 */
function updateCartQty(itemId, qty){
  let cart = loadCart();
  cart = cart.map(i => i.id===itemId ? {...i, qty: qty} : i).filter(i=>i.qty>0);
  saveCart(cart);
  renderCartUI();
}

function clearCart(){
  localStorage.removeItem(STORAGE_KEY);
  renderCartUI();
}

function cartTotal(){
  const cart = loadCart();
  const total = cart.reduce((s,i)=> s + (i.price * i.qty), 0);
  return Math.round(total*100)/100;
}

/* -------------------------
   RENDERING FUNCTIONS
------------------------- */
function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  FLAVORS.forEach(f=>{
    const card = document.createElement('div');
    card.className = 'card product-card';
    card.innerHTML = `
      <img src="${f.img}" alt="${f.name}">
      <div class="card-body">
        <h3>${f.name}</h3>
        <p class="price">$${f.price.toFixed(2)} / dozen</p>
        <p>${f.short}</p>
        <div class="actions" style="margin-top:8px">
          <input class="qty-input" type="number" min="1" value="1" id="qty-${f.id}">
          <button class="btn" data-add="${f.id}">Add to cart</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach add listeners
  document.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.getAttribute('data-add');
      const qtyInput = document.getElementById('qty-'+id);
      const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
      addToCart(id, qty);
    });
  });
}

function renderFeaturedFlavors(){
  const container = document.getElementById('featuredFlavors');
  if(!container) return;
  container.innerHTML = '';
  // show first 3 flavors
  FLAVORS.slice(0,3).forEach(f=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${f.img}" alt="${f.name}">
      <div class="card-body">
        <h3>${f.name}</h3>
        <p class="price">$${f.price.toFixed(2)} / dozen</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderHomeReviews(){
  const homeReviews = document.getElementById('homeReviews');
  if(!homeReviews) return;
  homeReviews.innerHTML = '';
  REVIEWS.slice(0,2).forEach(r=>{
    const rc = document.createElement('div');
    rc.className = 'review-card';
    rc.innerHTML = `<p>"${r.text}"</p><p><strong>— ${r.author}</strong></p>`;
    homeReviews.appendChild(rc);
  });
}

function renderGallery(){
  const photoGrid = document.getElementById('photoGrid');
  if(photoGrid){
    photoGrid.innerHTML = '';
    PHOTOS.forEach(p=>{
      const img = document.createElement('img');
      img.src = p;
      img.loading = 'lazy';
      photoGrid.appendChild(img);
    });
  }
  const allReviews = document.getElementById('allReviews');
  if(allReviews){
    allReviews.innerHTML = '';
    REVIEWS.forEach(r=>{
      const rc = document.createElement('div');
      rc.className = 'review-card';
      rc.innerHTML = `<p>"${r.text}"</p><p><strong>— ${r.author}</strong></p>`;
      allReviews.appendChild(rc);
    });
  }
}

function renderSpecials(){
  const s = document.getElementById('specialsList');
  if(!s) return;
  s.innerHTML = '';
  // Example: pick two specials from FLAVORS or separate specials array (customize)
  const specials = FLAVORS.slice(0,2); // change as needed
  specials.forEach(f=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${f.img}" alt="${f.name}">
      <div class="card-body">
        <h3>${f.name}</h3>
        <p class="price">$${f.price.toFixed(2)} / dozen</p>
        <p>${f.short}</p>
      </div>
    `;
    s.appendChild(div);
  });
}

/* Renders cart UI */
function renderCartUI(){
  const container = document.getElementById('cartItems');
  if(!container) return;
  const cart = loadCart();
  container.innerHTML = '';
  if(cart.length === 0){
    container.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="meta">
          <h4>${item.name}</h4>
          <small>$${item.price.toFixed(2)} / dozen</small>
        </div>
        <div class="qty">
          <input type="number" min="1" value="${item.qty}" data-update="${item.id}" class="qty-input">
        </div>
        <div class="item-sub">$${(item.qty * item.price).toFixed(2)}</div>
        <div><button class="btn neutral" data-remove="${item.id}">Remove</button></div>
      `;
      container.appendChild(div);
    });

    // attach update listeners
    document.querySelectorAll('[data-update]').forEach(inp=>{
      inp.addEventListener('change', e=>{
        const id = inp.getAttribute('data-update');
        const qty = Math.max(1, parseInt(inp.value || '1', 10));
        updateCartQty(id, qty);
      });
    });
    document.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-remove');
        updateCartQty(id, 0);
      });
    });
  }

  document.getElementById('cartTotal').textContent = '$' + cartTotal().toFixed(2);
}

/* -------------------------
   CHECKOUT: posts order to endpoint or falls back to local confirm
   Set APPS_SCRIPT_ENDPOINT in README to enable server-side storage
------------------------- */
const APPS_SCRIPT_ENDPOINT = ''; // <-- OPTIONAL: set your Google Apps Script web app URL here

function handleCheckoutForm(){
  const form = document.getElementById('checkoutForm');
  if(!form) return;

  const methodSelect = document.getElementById('method');
  const addressRow = document.getElementById('addressRow');

  methodSelect && methodSelect.addEventListener('change', (e)=>{
    if(e.target.value === 'shipping') addressRow.classList.remove('hidden');
    else addressRow.classList.add('hidden');
  });

  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const cart = loadCart();
    if(cart.length === 0){
      showStatus('Your cart is empty', true);
      return;
    }

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      method: form.method.value,
      address: form.address ? form.address.value.trim() : '',
      notes: form.notes.value.trim(),
      items: cart,
      total: cartTotal(),
      createdAt: new Date().toISOString()
    };

    showStatus('Submitting order...', false);

    // If APPS_SCRIPT_ENDPOINT configured, POST it there
    if(APPS_SCRIPT_ENDPOINT){
      try{
        const res = await fetch(APPS_SCRIPT_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        });
        if(!res.ok) throw new Error('Server error');
        const json = await res.json();
        showStatus('Order submitted! We will contact you soon. (Server ID: ' + (json.id || 'n/a') + ')', false);
        clearCart();
        form.reset();
      }catch(err){
        console.error(err);
        showStatus('There was an error submitting order to the server. Order saved locally. Please contact us if needed.', true);
        // fallback: save locally (you can inspect in localStorage)
        localStorage.setItem('tgc_last_order', JSON.stringify(formData));
        clearCart();
        form.reset();
      }
    } else {
      // No endpoint: save order locally and show a friendly message
      localStorage.setItem('tgc_last_order', JSON.stringify(formData));
      showStatus('Order saved locally (no external endpoint configured). We will contact you to confirm pickup/shipping.', false);
      clearCart();
      form.reset();
    }
  });
}

function showStatus(msg, isError){
  const el = document.getElementById('orderStatus');
  if(!el) return;
  el.textContent = msg;
  el.style.color = isError ? '#8b1b1b' : '#225522';
}

/* -------------------------
   INIT — runs on DOMContentLoaded
------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  renderCartUI();
  renderFeaturedFlavors();
  renderHomeReviews();
  renderGallery();
  renderSpecials();
  handleCheckoutForm();

  const clearBtn = document.getElementById('clearCart');
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ if(confirm('Clear cart?')) clearCart(); });
});
