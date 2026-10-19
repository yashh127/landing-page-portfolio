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

// 5. Gemini AI Creative Studio Implementation
function saveGeminiKey() {
  const input = document.getElementById('gemini-api-key');
  if (input && input.value.trim()) {
    localStorage.setItem('gemini_api_key', input.value.trim());
    alert('Gemini API Key saved securely in your browser!');
  } else if (input) {
    localStorage.removeItem('gemini_api_key');
    alert('Custom Gemini API Key removed. Using default engine.');
  }
}

// Auto-fill stored key if available
document.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('gemini_api_key');
  const keyInput = document.getElementById('gemini-api-key');
  if (savedKey && keyInput) {
    keyInput.value = savedKey;
  }
});

async function generateAiLandingPagePlan() {
  const btn = document.getElementById('ai-generate-btn');
  const name = document.getElementById('ai-product-name').value.trim() || 'Your Product';
  const desc = document.getElementById('ai-description').value.trim() || 'A modern digital service';
  const platform = document.getElementById('ai-platform').value;
  const apiKey = localStorage.getItem('gemini_api_key') || (document.getElementById('gemini-api-key') ? document.getElementById('gemini-api-key').value.trim() : '');

  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-sparkle">⏳</span><span>Consulting Gemini AI...</span>`;

  try {
    let result = null;

    if (apiKey) {
      try {
        const prompt = `You are a world-class landing page strategist and direct-response copywriter.
A client wants a high-converting landing page for:
Product: "${name}"
Description: "${desc}"
Target Platform: "${platform}"

Provide a JSON response with:
1. "headlines": An array of 3 distinct, punchy landing page headlines:
   - One focusing on emotional hook/curiosity (tag: "Hook")
   - One focusing on the core pain point & agitation (tag: "Pain Point")
   - One focusing on direct quantifiable benefit (tag: "Direct Benefit")
2. "recommendedPlatform": Name of the best platform (Custom Code, Wix Studio, or Squarespace).
3. "reasoning": A 2-sentence rationale explaining why this platform is the best fit for their tech needs, budget, and editing flexibility.

Return ONLY raw valid JSON, no markdown codeblocks.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            result = JSON.parse(candidateText);
          }
        }
      } catch (err) {
        console.warn('Gemini API call error, falling back to heuristic engine:', err);
      }
    }

    // Heuristic generator fallback (runs if no key or API call failed)
    if (!result) {
      await new Promise(r => setTimeout(r, 650)); // smooth simulation
      result = generateHeuristicPlan(name, desc, platform);
    }

    displayAiResults(name, result);
  } catch (error) {
    console.error('Error generating strategy:', error);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

function generateHeuristicPlan(name, desc, platform) {
  let recPlatform = platform;
  let reasoning = '';

  if (platform.includes('Let Yash Recommend') || platform.includes('Any')) {
    const textLower = (name + ' ' + desc).toLowerCase();
    if (textLower.includes('saas') || textLower.includes('code') || textLower.includes('tool') || textLower.includes('api') || textLower.includes('app')) {
      recPlatform = 'Custom Code (HTML / Tailwind / JS)';
      reasoning = `For a tech-focused product like ${name}, hand-crafted custom code guarantees sub-second load times, 100/100 PageSpeed scores, and zero CMS subscription fees.`;
    } else if (textLower.includes('bakery') || textLower.includes('restaurant') || textLower.includes('event') || textLower.includes('agency') || textLower.includes('store')) {
      recPlatform = 'Wix / Wix Studio';
      reasoning = `For local businesses and dynamic content, Wix Studio offers responsive design combined with an intuitive client dashboard to update menus and appointments effortlessly.`;
    } else {
      recPlatform = 'Squarespace 7.1';
      reasoning = `Squarespace gives ${name} an editorial, high-end magazine aesthetic with built-in scheduling, making it perfect for consultants, writers, and boutique creators.`;
    }
  } else {
    reasoning = `Custom-built on ${platform}: Yash will configure ${platform}'s design system so you get custom layouts without sacrificing your ability to edit text later.`;
  }

  return {
    headlines: [
      { text: `Stop losing leads to outdated websites. Meet ${name}.`, tag: 'Hook' },
      { text: `The fastest way to automate ${desc.slice(0, 30)}... and win more clients.`, tag: 'Direct Benefit' },
      { text: `Why top founders are switching to ${name} this year.`, tag: 'Pain Point' }
    ],
    recommendedPlatform: recPlatform,
    reasoning: reasoning
  };
}

function displayAiResults(name, data) {
  const outputBox = document.getElementById('ai-output-box');
  const platformBadge = document.getElementById('ai-platform-chosen');
  const headlinesContainer = document.getElementById('ai-headlines-list');
  const reasoningEl = document.getElementById('ai-platform-reasoning');

  platformBadge.innerText = `Recommended: ${data.recommendedPlatform || 'Custom Code'}`;
  reasoningEl.innerText = data.reasoning || 'Custom architecture designed for peak conversions and rapid delivery.';

  headlinesContainer.innerHTML = '';
  (data.headlines || []).forEach(item => {
    const card = document.createElement('div');
    card.className = 'headline-card';
    card.innerHTML = `
      <span class="headline-text">"${item.text}"</span>
      <span class="headline-tag">${item.tag || 'Headline'}</span>
    `;
    headlinesContainer.appendChild(card);
  });

  outputBox.style.display = 'block';
  outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hireYashWithBrief() {
  const name = document.getElementById('ai-product-name').value;
  const platform = document.getElementById('ai-platform-chosen').innerText;
  const messageInput = document.getElementById('message');
  
  messageInput.value = `Hi Yash, I used your Gemini AI Creative Studio! I am building "${name}" and want to move forward with ${platform}. Let's discuss getting started!`;
  
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  messageInput.focus();
}
