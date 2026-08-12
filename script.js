/* ============================================================
   script.js — Alok Kumar's Portfolio
   Pure vanilla JS · No external libraries
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     2. Navbar Scroll Effect
     Adds .scrolled class when user scrolls past 50px
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', scrollY > 50);
      
      // Update top scroll progress bar dynamically
      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
      }
    });
  }

  /* ----------------------------------------------------------
     3. Active Section Tracking (Intersection Observer)
     Highlights the nav link matching the section in view
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ----------------------------------------------------------
     4. Hamburger Menu
     Toggle open/close, close on link click & outside click
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
      const isOpen = navLinksContainer.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      if (isOpen && navLinksContainer.querySelector('a')) {
        navLinksContainer.querySelector('a').focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });

    // Close menu when any nav link is clicked
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !hamburger.contains(e.target) &&
        !navLinksContainer.contains(e.target)
      ) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
      }
    });
  }

  /* ----------------------------------------------------------
     5. Smooth Scroll
     Intercept all anchor links and scroll smoothly
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return; // guard against bare # logo link
      e.preventDefault();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', targetId);
      }
    });
  });

  /* ----------------------------------------------------------
     6. Theme Toggle
     Switch between dark / light, persist in localStorage
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');

  // Restore saved theme on load
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      if (themeIcon) {
        themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
      }
    });
  }

  /* ----------------------------------------------------------
     7. Typewriter Effect
     Cycles through roles with type-then-delete animation
  ---------------------------------------------------------- */
  const roles = [
    'Data Engineer',
    'Data Analyst',
    'AI Systems Builder',
    'Python Developer',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const roleText = document.getElementById('role-text');

  function typeWriter() {
    if (!roleText) return;

    const current = roles[roleIndex];

    if (isDeleting) {
      roleText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500; // brief pause before next word
    }

    setTimeout(typeWriter, delay);
  }

  if (prefersReducedMotion) {
    if (roleText) roleText.textContent = roles[0];
  } else {
    typeWriter();
  }

  /* ----------------------------------------------------------
     8. Interactive Particle Canvas
     Floating particles with mouse attraction & connections
  ---------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  const container = document.querySelector('.hero-canvas-container');

  if (canvas && container && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');

    // Accent palette
    const accentColors = [
      'rgba(124, 106, 255,', // violet
      'rgba(212, 168, 67,',  // gold
      'rgba(46, 196, 182,',  // teal
    ];

    let mouse = { x: -1000, y: -1000 };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    canvas.addEventListener(
      'touchmove',
      (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      },
      { passive: true }
    );

    let particles = [];

    /** Fit canvas to container and dynamically re-scale particle density */
    function initParticles() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Calculate optimal particle count based on screen resolution (min 30, max 100)
      const targetCount = Math.min(100, Math.max(30, Math.floor((canvas.width * canvas.height) / 14000)));
      
      particles = [];
      for (let i = 0; i < targetCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: accentColors[Math.floor(Math.random() * accentColors.length)],
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          sinOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    /** Main render loop */
    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;

      particles.forEach((p, i) => {
        // Sine-wave drift for organic movement
        p.x += p.vx + Math.sin(time + p.sinOffset) * 0.15;
        p.y += p.vy + Math.cos(time + p.sinOffset) * 0.15;

        // Mouse attraction within 200px radius
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          p.x += dx * 0.008;
          p.y += dy * 0.008;
        }

        // Bounce off canvas edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.6)';
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color + (0.15 * (1 - d / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  /* ----------------------------------------------------------
     9. Scroll Reveal
     Elements with .reveal fade in once they enter viewport
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     10. Stats Counter Animation
     Counts from 0 → data-target over 2 s with easeOutQuad
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  /**
   * Animate a single stat element from 0 to its data-target.
   * Uses easeOutQuad: t * (2 - t)
   */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000; // ms
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress); // easeOutQuad
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // ensure exact final value
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  statNumbers.forEach((el) => statsObserver.observe(el));



  /* ----------------------------------------------------------
     12. Contact Form (Formspree)
     Validates, shows loading state, then success message
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Client-side validation
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      });
      if (!isValid) return;

      const btnText = document.querySelector('.btn-text');
      const btnLoading = document.querySelector('.btn-loading');
      const formSuccess = document.getElementById('form-success');
      const formError = document.getElementById('form-error');
      const submitBtn = document.getElementById('btn-submit');

      // Show loading state
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';
      if (submitBtn) submitBtn.disabled = true;
      if (formError) formError.style.display = 'none';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          if (formSuccess) formSuccess.style.display = 'block';
          contactForm.reset();
          setTimeout(() => {
            if (formSuccess) formSuccess.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        if (formError) formError.style.display = 'block';
        setTimeout(() => {
          if (formError) formError.style.display = 'none';
        }, 5000);
      } finally {
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ----------------------------------------------------------
     13. Back to Top
     Smooth-scroll to #hero on click
  ---------------------------------------------------------- */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ----------------------------------------------------------
     14. Dynamic 3D Card Tilt Interaction
     Adds dynamic 3D perspective tilt on hover across desktop & laptops
  ---------------------------------------------------------- */
  if (window.innerWidth > 768 && !prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.service-card, .project-card, .skill-item, .creative-item');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
});
