/* ============================================================
   script.js — Ian's Portfolio
   Pure vanilla JS · No external libraries
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

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
    '⚡ Vibe Coder',
    'Data Analyst',
    'Prompt Engineer',
    'Quant Systems Engineer',
    'Technical Writer',
    'R&D Specialist',
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

  typeWriter();

  /* ----------------------------------------------------------
     8. Interactive Particle Canvas
     Floating particles with mouse attraction & connections
  ---------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  const container = document.querySelector('.hero-canvas-container');

  if (canvas && container) {
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
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
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
     11. Testimonials Auto-Scroll
     Scrolls one card every 4 s, pauses on hover
  ---------------------------------------------------------- */
  const testimonialsTrack = document.getElementById('testimonials-track');

  if (testimonialsTrack) {
    let autoScrollInterval = null;

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        const firstCard = testimonialsTrack.firstElementChild;
        if (!firstCard) return;

        // Card width + gap (read computed gap or default to 24px)
        const gap =
          parseInt(getComputedStyle(testimonialsTrack).gap, 10) || 24;
        const scrollAmount = firstCard.offsetWidth + gap;

        // If we've reached the end, reset to start
        if (
          testimonialsTrack.scrollLeft + testimonialsTrack.offsetWidth >=
          testimonialsTrack.scrollWidth
        ) {
          testimonialsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          testimonialsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 4000);
    }

    startAutoScroll();

    // Pause on hover
    testimonialsTrack.addEventListener('mouseenter', () => {
      clearInterval(autoScrollInterval);
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
      startAutoScroll();
    });
  }

  /* ----------------------------------------------------------
     12. Contact Form (simulated submit)
     Validates, shows loading state, then success message
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (!isValid) return;

      // Show loading state
      const btnLoading = contactForm.querySelector('.btn-loading');
      const btnText = contactForm.querySelector('.btn-text');

      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-block';

      // Simulate network request (2 s)
      setTimeout(() => {
        // Restore button
        if (btnText) btnText.style.display = '';
        if (btnLoading) btnLoading.style.display = 'none';

        // Show success message
        const successMsg = document.getElementById('form-success');
        if (successMsg) {
          successMsg.style.display = 'block';

          // Hide after 3 seconds
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 3000);
        }

        contactForm.reset();
      }, 2000);
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
  if (window.innerWidth > 768) {
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
