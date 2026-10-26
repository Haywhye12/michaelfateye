/**
 * FATEYE MICHEAL ADEDIRAN - EXECUTIVE PORTFOLIO INTERACTION ENGINE
 * Theme: Modern Classic Luxury
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNavigation();
  initCounters();
  initTimelineFilter();
  initRiskCalculator();
  initResumeModal();
  initContactForm();
  initBackToTop();
  initScrollProgress();
  initScrollReveals();
});

/* ===================================================================
   1. THEME SWITCHER (Midnight Luxury vs Classical Ivory)
   =================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('executive_theme') || (prefersDark ? 'dark' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('executive_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (theme === 'light') {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  } else {
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
}

/* ===================================================================
   2. NAVIGATION & SCROLLSPY
   =================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ===================================================================
   3. ANIMATED METRICS COUNTERS
   =================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.metric-number[data-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ===================================================================
   4. TIMELINE CATEGORY FILTER
   =================================================================== */
function initTimelineFilter() {
  const filterBtns = document.querySelectorAll('.timeline-tab-btn');
  const items = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/* ===================================================================
   5. INTERACTIVE UNDERWRITING RISK CALCULATOR
   =================================================================== */
function initRiskCalculator() {
  const lineSelect = document.getElementById('calcRiskLine');
  const sumInsuredInput = document.getElementById('calcSumInsured');
  const mplSlider = document.getElementById('calcMplSlider');
  const mplDisplay = document.getElementById('calcMplDisplay');
  const riskMitigationSelect = document.getElementById('calcRiskMitigation');

  // Outputs
  const mplExposureDisplay = document.getElementById('calcMplExposure');
  const retentionDisplay = document.getElementById('calcRetentionVal');
  const reinsuranceDisplay = document.getElementById('calcReinsuranceVal');
  const riskBadge = document.getElementById('calcRiskBadge');
  const retentionFill = document.getElementById('calcRetentionFill');
  const reinsuranceFill = document.getElementById('calcReinsuranceFill');
  const adviceText = document.getElementById('calcAdviceText');

  if (!lineSelect || !sumInsuredInput || !mplSlider) return;

  function calculateExposure() {
    const sumInsured = parseFloat(sumInsuredInput.value) || 0; // In Millions NGN
    const mplPercent = parseFloat(mplSlider.value) || 25;
    const line = lineSelect.value;
    const mitigation = riskMitigationSelect.value;

    mplDisplay.textContent = `${mplPercent}%`;

    // Maximum Probable Loss (MPL) exposure
    const exposure = sumInsured * (mplPercent / 100);

    // Format currency (Million / Billion)
    function formatNaira(num) {
      if (num >= 1000) {
        return `₦${(num / 1000).toFixed(2)} Billion`;
      }
      return `₦${num.toFixed(1)} Million`;
    }

    mplExposureDisplay.textContent = formatNaira(exposure);

    // Company Retention Capacity Benchmark (e.g. ₦150M retention limit per risk)
    const companyRetentionLimit = 150; // Millions
    let retentionAmount = Math.min(exposure, companyRetentionLimit);
    let reinsuranceAmount = Math.max(0, exposure - companyRetentionLimit);

    let retentionPct = 100;
    let reinsurancePct = 0;
    if (exposure > 0) {
      retentionPct = Math.round((retentionAmount / exposure) * 100);
      reinsurancePct = 100 - retentionPct;
    }

    retentionDisplay.textContent = `${formatNaira(retentionAmount)} (${retentionPct}%)`;
    reinsuranceDisplay.textContent = `${formatNaira(reinsuranceAmount)} (${reinsurancePct}%)`;

    if (retentionFill && reinsuranceFill) {
      retentionFill.style.width = `${retentionPct}%`;
      reinsuranceFill.style.width = `${reinsurancePct}%`;
    }

    // Determine Risk Profile Badge & Recommendation
    let rating = 'Standard';
    let badgeClass = 'risk-level-low';
    let advice = '';

    if (mitigation === 'high' && mplPercent <= 30) {
      rating = 'Low Risk Exposure (Optimum)';
      badgeClass = 'risk-level-low';
      advice = 'Acceptable on standard terms. Self-contained risk with high-grade fire/safety suppression. Company treaty retention fully accommodates exposure.';
    } else if (mitigation === 'substandard' || mplPercent >= 60 || exposure > 300) {
      rating = 'Elevated Risk / Facultative Cession Needed';
      badgeClass = 'risk-level-high';
      advice = 'Mandatory Pre-loss Engineering Survey required. Surplus exposure exceeds internal retention capacity; structure co-insurance slip with lead insurer approval and quote commensurate deductible.';
    } else {
      rating = 'Moderate Commercial Risk';
      badgeClass = 'risk-level-moderate';
      advice = 'Satisfactory risk profiling. Apply standard market warranty clauses (Fire Extinguishing Appliances, Watchman warranty) and assess loss history before policy document approval.';
    }

    riskBadge.textContent = rating;
    riskBadge.className = `risk-level-badge ${badgeClass}`;
    adviceText.textContent = advice;
  }

  lineSelect.addEventListener('change', calculateExposure);
  sumInsuredInput.addEventListener('input', calculateExposure);
  mplSlider.addEventListener('input', calculateExposure);
  riskMitigationSelect.addEventListener('change', calculateExposure);

  // Initial run
  calculateExposure();
}

/* ===================================================================
   6. RESUME PREVIEW MODAL & PRINT ENGINE
   =================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resumeModal');
  const openBtns = document.querySelectorAll('.open-resume-modal-btn');
  const closeBtn = document.getElementById('closeResumeModalBtn');
  const printBtn = document.getElementById('printResumeBtn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   7. CONTACT FORM HANDLER & WHATSAPP INTEGRATION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  const statusMsg = document.getElementById('formStatusMsg');
  const whatsappQuickBtn = document.getElementById('whatsappQuickBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const service = document.getElementById('formService').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        showStatus('Please complete all required fields.', 'error');
        return;
      }

      // Simulate executive dispatch with mailto fallback
      const subject = encodeURIComponent(`Consultation Inquiry: ${service} - from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry Type: ${service}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:madediran4002@gmail.com?subject=${subject}&body=${body}`;

      showStatus('Preparing your executive consultation dispatch...', 'success');

      setTimeout(() => {
        window.location.href = mailtoUrl;
        form.reset();
        showStatus('Inquiry dispatched! Fateye Micheal Adediran will review your request promptly.', 'success');
      }, 700);
    });
  }

  if (whatsappQuickBtn) {
    whatsappQuickBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const waText = encodeURIComponent('Hello Mr. Fateye Micheal Adediran, I am reaching out through your executive website regarding underwriting advisory / risk consultation.');
      window.open(`https://wa.me/2348038240492?text=${waText}`, '_blank');
    });
  }

  function showStatus(text, type) {
    if (!statusMsg) return;
    statusMsg.textContent = text;
    statusMsg.style.display = 'block';
    statusMsg.style.padding = '0.75rem 1rem';
    statusMsg.style.borderRadius = '6px';
    statusMsg.style.marginTop = '1rem';
    statusMsg.style.fontSize = '0.88rem';
    statusMsg.style.fontWeight = '500';

    if (type === 'success') {
      statusMsg.style.background = 'rgba(16, 185, 129, 0.15)';
      statusMsg.style.color = '#10b981';
      statusMsg.style.border = '1px solid #10b981';
    } else {
      statusMsg.style.background = 'rgba(239, 68, 68, 0.15)';
      statusMsg.style.color = '#ef4444';
      statusMsg.style.border = '1px solid #ef4444';
    }
  }
}

/* ===================================================================
   8. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   9. EXECUTIVE PRELOADER (SNAPPY & CINEMATIC)
   =================================================================== */
function initPreloader() {
  const preloader = document.getElementById('executivePreloader');
  const bar = document.getElementById('preloaderProgress');
  if (!preloader) return;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 22) + 18;
    if (progress > 100) progress = 100;
    if (bar) bar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.add('page-ready');
      }, 200);
    }
  }, 40);

  // Safety timer: maximum 850ms to ensure rapid page access
  setTimeout(() => {
    clearInterval(timer);
    if (bar) bar.style.width = '100%';
    preloader.classList.add('fade-out');
    document.body.classList.add('page-ready');
  }, 850);
}

/* ===================================================================
   10. SCROLL READING PROGRESS INDICATOR
   =================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  });
}

/* ===================================================================
   11. SCROLL REVEAL (INTERSECTION OBSERVER)
   =================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('[data-reveal], [data-stagger]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
