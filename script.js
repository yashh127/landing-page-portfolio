// Interactive functionality for Solo Studio Landing Page

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sync Pricing Cards with Contact Select
  const pricingButtons = document.querySelectorAll('.pricing-card .btn');
  const packageSelect = document.getElementById('tier-select');

  pricingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pricing-card');
      const title = card.querySelector('.tier-title').innerText.toLowerCase();

      if (title.includes('hero')) {
        packageSelect.value = 'hero';
      } else if (title.includes('complete 1-page') || title.includes('website')) {
        packageSelect.value = 'complete';
      } else if (title.includes('hosting') || title.includes('launch')) {
        packageSelect.value = 'launch';
      }
    });
  });
});

// 2. Interactive Demo: Team Pricing Calculator
function updatePricingDemo(val) {
  const teamVal = document.getElementById('team-size-val');
  const calcPrice = document.getElementById('calc-price');
  
  teamVal.innerText = `${val} ${val == 1 ? 'member' : 'members'}`;
  
  // Calculate price dynamically ($9/seat with slight discount for teams > 10)
  let cost = val * 9;
  if (val > 10) {
    cost = Math.round(cost * 0.85); // 15% volume discount
  }
  
  calcPrice.innerText = `$${cost}/mo`;
}

// 3. Interactive Demo: Lead Magnet Box
function triggerMiniDemoSubmit() {
  const input = document.getElementById('demo-email-input');
  const msg = document.getElementById('mini-demo-msg');

  if (!input.value || !input.value.includes('@')) {
    msg.innerText = '⚠️ Please enter a valid test email';
    msg.style.color = '#f87171';
    return;
  }

  msg.innerText = '✓ Success! Preview sent (simulated).';
  msg.style.color = '#34d399';
  input.value = '';
}

// 4. Contact Form Submission Feedback & Email Dispatch
function handleFormSubmit() {
  const feedback = document.getElementById('form-feedback');
  const form = document.getElementById('contact-form');
  const name = document.getElementById('name').value;
  const emailOrHandle = document.getElementById('email').value;
  const service = document.getElementById('tier-select').value;
  const message = document.getElementById('message').value;

  feedback.innerText = `Thanks ${name}! Opening your email client to send your inquiry directly to Yash...`;
  feedback.className = 'form-feedback success';

  // Construct mailto link
  const subject = encodeURIComponent(`Project Inquiry from ${name} (${service})`);
  const body = encodeURIComponent(`Hi Yash,\n\nMy name is ${name} (${emailOrHandle}).\nI am interested in: ${service}\n\nProject details:\n${message}\n`);
  
  setTimeout(() => {
    window.location.href = `mailto:yashpanjwani128@gmail.com?subject=${subject}&body=${body}`;
  }, 600);

  form.reset();

  setTimeout(() => {
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}
