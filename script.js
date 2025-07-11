// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Form Submission Handler
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value;
  
  // Here you would normally send the data to a server
  // For now, we'll just show an alert
  alert(`Thank you for your message, ${name}! We'll contact you soon at ${email} regarding your ${service} service request.`);
  
  // Reset form
  contactForm.reset();
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s ease';
  observer.observe(card);
});

// Observe pricing cards
document.querySelectorAll('.pricing-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s ease';
  observer.observe(card);
});

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Stripe Configuration
// IMPORTANT: Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626'
    }
  }
});

// Mount card element when modal opens
let currentPrice = 0;
let currentService = '';

// Payment Modal
const modal = document.getElementById('paymentModal');
const closeModal = document.getElementsByClassName('close')[0];

// Handle Stripe checkout button clicks
document.querySelectorAll('.stripe-checkout').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    currentPrice = parseInt(button.dataset.price);
    currentService = button.dataset.name;
    
    // Update payment details
    document.getElementById('paymentDetails').innerHTML = `
      <h3>${currentService}</h3>
      <p>Total: $${currentPrice}</p>
    `;
    
    // Show modal
    modal.style.display = 'block';
    
    // Mount Stripe card element
    cardElement.mount('#card-element');
    
    // Show appointment fields for services
    document.getElementById('appointmentDate').closest('.form-group').style.display = 'block';
    document.getElementById('appointmentTime').closest('.form-group').style.display = 'block';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', today);
  });
});

// Close modal
closeModal.onclick = function() {
  modal.style.display = 'none';
  cardElement.unmount();
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    cardElement.unmount();
  }
}

// Handle form submission
const paymentForm = document.getElementById('payment-form');
paymentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitButton = document.getElementById('submit-payment');
  const buttonText = document.getElementById('button-text');
  
  // Disable button and show loading
  submitButton.disabled = true;
  buttonText.textContent = 'Processing...';
  
  // Get form data
  const customerName = document.getElementById('customerName').value;
  const customerEmail = document.getElementById('customerEmail').value;
  const customerPhone = document.getElementById('customerPhone').value;
  const appointmentDate = document.getElementById('appointmentDate').value;
  const appointmentTime = document.getElementById('appointmentTime').value;
  
  try {
    // In a real implementation, you would:
    // 1. Send payment details to your server
    // 2. Create a payment intent on the server
    // 3. Confirm the payment with Stripe
    
    // For demo purposes, we'll simulate a successful payment
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      }
    });
    
    if (error) {
      // Show error to customer
      document.getElementById('card-errors').textContent = error.message;
      submitButton.disabled = false;
      buttonText.textContent = 'Pay Now';
    } else {
      // Payment method created successfully
      // In production, send paymentMethod.id to your server
      
      // Simulate successful payment
      setTimeout(() => {
        alert(`Payment successful! 
        
Service: ${currentService}
Amount: $${currentPrice}
Date: ${appointmentDate}
Time: ${appointmentTime}

We'll send a confirmation email to ${customerEmail}`);
        
        modal.style.display = 'none';
        paymentForm.reset();
        cardElement.clear();
        submitButton.disabled = false;
        buttonText.textContent = 'Pay Now';
      }, 2000);
    }
  } catch (err) {
    console.error('Payment error:', err);
    document.getElementById('card-errors').textContent = 'Payment failed. Please try again.';
    submitButton.disabled = false;
    buttonText.textContent = 'Pay Now';
  }
});

// Display card errors
cardElement.on('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

// Add loading animation to form submit button
contactForm.addEventListener('submit', function() {
  const submitButton = this.querySelector('button[type="submit"]');
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitButton.disabled = true;
  
  // Reset button after 2 seconds (simulating form submission)
  setTimeout(() => {
    submitButton.innerHTML = 'Send Message';
    submitButton.disabled = false;
  }, 2000);
});

// Counter animation for stats
const animateCounter = (element, target) => {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.parentElement.textContent.includes('+') ? '+' : '%');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.parentElement.textContent.includes('+') ? '+' : '%');
    }
  }, 20);
};

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        const counters = entry.target.querySelectorAll('.stat h3');
        counters[0] && animateCounter(counters[0], 5000);
        counters[1] && animateCounter(counters[1], 10);
        counters[2] && animateCounter(counters[2], 100);
      }
    });
  }, { threshold: 0.5 });
  
  statsObserver.observe(statsSection);
}

// Shopping Cart Functionality
let cart = [];
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('sudzBubbzCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('sudzBubbzCart', JSON.stringify(cart));
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    const product = this.dataset.product;
    const price = parseFloat(this.dataset.price);
    const card = this.closest('.merch-card');
    
    // Get selected options
    const sizeSelect = card.querySelector('.size-select');
    const colorSelect = card.querySelector('.color-select');
    
    // Validate selections
    if (sizeSelect && !sizeSelect.value) {
      alert('Please select a size');
      sizeSelect.focus();
      return;
    }
    
    if (colorSelect && !colorSelect.value) {
      alert('Please select a color');
      colorSelect.focus();
      return;
    }
    
    // Create cart item
    const cartItem = {
      id: Date.now(),
      product: product,
      price: price,
      size: sizeSelect ? sizeSelect.value : null,
      color: colorSelect ? colorSelect.value : null
    };
    
    // Add to cart
    cart.push(cartItem);
    saveCart();
    updateCartDisplay();
    
    // Show success message
    this.innerHTML = '<i class="fas fa-check"></i> Added!';
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    }, 1500);
    
    // Reset selections
    if (sizeSelect) sizeSelect.value = '';
    if (colorSelect) colorSelect.value = '';
  });
});

// Update cart display
function updateCartDisplay() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    cartTotal.style.display = 'none';
    cartCount.textContent = '(0)';
  } else {
    // Update cart items
    cartItemsContainer.innerHTML = cart.map(item => {
      let details = [];
      if (item.size) details.push(`Size: ${item.size}`);
      if (item.color) details.push(`Color: ${item.color}`);
      
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.product}</h4>
            <p>${details.join(', ')}</p>
          </div>
          <div class="cart-item-price">
            <span>$${item.price.toFixed(2)}</span>
            <button class="remove-item" data-id="${item.id}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
    cartTotal.style.display = 'block';
    cartCount.textContent = `(${cart.length})`;
    
    // Add remove functionality
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartDisplay();
      });
    });
  }
}

// Checkout functionality
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Show payment modal with merchandise details
    currentPrice = total;
    currentService = 'Merchandise Order';
    
    // Update payment details with cart items
    const itemsList = cart.map(item => {
      let details = [];
      if (item.size) details.push(`Size: ${item.size}`);
      if (item.color) details.push(`Color: ${item.color}`);
      return `<li>${item.product} ${details.length ? '(' + details.join(', ') + ')' : ''} - $${item.price.toFixed(2)}</li>`;
    }).join('');
    
    document.getElementById('paymentDetails').innerHTML = `
      <h3>Merchandise Order</h3>
      <ul style="list-style: none; padding: 0; margin: 1rem 0;">
        ${itemsList}
      </ul>
      <p style="font-weight: bold; font-size: 1.25rem;">Total: $${total.toFixed(2)}</p>
    `;
    
    // Show modal
    modal.style.display = 'block';
    
    // Mount Stripe card element
    cardElement.mount('#card-element');
    
    // Hide appointment fields for merchandise
    document.getElementById('appointmentDate').closest('.form-group').style.display = 'none';
    document.getElementById('appointmentTime').closest('.form-group').style.display = 'none';
  });
}

// Clear cart after successful payment
const originalPaymentHandler = paymentForm.onsubmit;
paymentForm.addEventListener('submit', async function(e) {
  if (currentService === 'Merchandise Order') {
    // After successful payment, clear the cart
    setTimeout(() => {
      cart = [];
      saveCart();
      updateCartDisplay();
    }, 2000);
  }
});

// Load cart on page load
loadCart();

// Animate merchandise cards on scroll
document.querySelectorAll('.merch-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s ease';
  observer.observe(card);
});
