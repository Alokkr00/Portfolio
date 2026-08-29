/* ============================================================
   PIPELINE THEME — script.js
   High-performance Interactive Pipeline Particle Stream & Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. Navbar Scroll Effect & Dynamic Progress Indicator
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');

  if (navbar) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', scrollY > 40);

      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. Active Section Tracking (Intersection Observer)
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ----------------------------------------------------------
     3. Accessible Mobile Navigation
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
      const isOpen = navLinksContainer.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      if (isOpen && navLinksContainer.querySelector('a')) {
        navLinksContainer.querySelector('a').focus();
      }
    };

    hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     4. Smooth Scroll with Hash Management
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', targetId);
      }
    });
  });

  /* ----------------------------------------------------------
     5. Theme Toggle & Local Storage
  ---------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

  const getSavedTheme = () => localStorage.getItem('theme') || 'dark';
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  };

  applyTheme(getSavedTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  /* ----------------------------------------------------------
     6. Role Typewriter Animation
  ---------------------------------------------------------- */
  const roles = [
    'Data Engineer',
    'Data Analyst',
    'AI Systems Builder',
    'Quantitative Developer',
    'Python & SQL Specialist'
  ];

  const roleTextEl = document.getElementById('role-text');
  if (roleTextEl) {
    if (prefersReducedMotion) {
      roleTextEl.textContent = roles[0];
    } else {
      let roleIdx = 0;
      let charIdx = 0;
      let isDeleting = false;

      function typeWriterLoop() {
        const currentRole = roles[roleIdx];
        if (isDeleting) {
          roleTextEl.textContent = currentRole.substring(0, charIdx - 1);
          charIdx--;
        } else {
          roleTextEl.textContent = currentRole.substring(0, charIdx + 1);
          charIdx++;
        }

        let delay = isDeleting ? 35 : 75;

        if (!isDeleting && charIdx === currentRole.length) {
          delay = 2200;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          delay = 450;
        }

        setTimeout(typeWriterLoop, delay);
      }

      typeWriterLoop();
    }
  }

  /* ----------------------------------------------------------
     7. Interactive Pipeline Data Stream Canvas
  ---------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.hero-canvas-container');
    let animationId;
    let width, height;

    function resize() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -1000, y: -1000 };
    container.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Generate Pipeline Nodes
    const nodeCount = Math.min(Math.floor(window.innerWidth / 22), 55);
    const nodes = [];
    const colors = [
      'rgba(0, 229, 255,',   // Cyber cyan
      'rgba(56, 189, 248,',  // Pipeline blue
      'rgba(16, 185, 129,',  // Emerald telemetry
      'rgba(129, 140, 248,'  // Indigo AI
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }

    function renderPipeline() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.0015;

      // Draw Connections (Data Buses)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Move node
        n1.x += n1.vx + Math.sin(time + n1.pulse) * 0.15;
        n1.y += n1.vy + Math.cos(time + n1.pulse) * 0.15;

        // Bounce
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - n1.x;
        const dy = mouse.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          n1.x += dx * 0.008;
          n1.y += dy * 0.008;
        }

        // Connect with nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const distNodes = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (distNodes < 140) {
            const alpha = (1 - distNodes / 140) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw Node
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${n1.color} 0.85)`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(renderPipeline);
    }

    renderPipeline();

    // Pause canvas when document is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        renderPipeline();
      }
    });
  }

  /* ----------------------------------------------------------
     8. Scroll Reveal Observer
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    if (prefersReducedMotion) {
      revealElements.forEach((el) => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ----------------------------------------------------------
     9. Stats Counter Animation
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            const duration = 1600;
            const start = performance.now();

            function updateCounter(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart
              const ease = 1 - Math.pow(1 - progress, 4);
              el.textContent = Math.floor(ease * target);

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target;
              }
            }

            requestAnimationFrame(updateCounter);
            statsObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => statsObserver.observe(el));
  }

  /* ----------------------------------------------------------
     10. Contact Form Submission (Formspree Async Fetch)
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

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

      const btnText = contactForm.querySelector('.btn-text');
      const btnLoading = contactForm.querySelector('.btn-loading');
      const formSuccess = document.getElementById('form-success');
      const formError = document.getElementById('form-error');
      const submitBtn = document.getElementById('btn-submit');

      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';
      if (submitBtn) submitBtn.disabled = true;
      if (formSuccess) formSuccess.style.display = 'none';
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
          }, 6000);
        } else {
          throw new Error('Server returned non-200 status');
        }
      } catch (err) {
        if (formError) formError.style.display = 'block';
        setTimeout(() => {
          if (formError) formError.style.display = 'none';
        }, 6000);
      } finally {
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});
