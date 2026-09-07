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
              const isCurrent = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('active', isCurrent);
              if (isCurrent) {
                link.setAttribute('aria-current', 'page');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ----------------------------------------------------------
     3. Accessible Mobile Navigation & Focus Trap
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    const closeMenu = (restoreFocus = true) => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-locked');
      if (restoreFocus) {
        hamburger.focus();
      }
    };

    const openMenu = () => {
      hamburger.classList.add('active');
      navLinksContainer.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-locked');
      const firstLink = navLinksContainer.querySelector('a');
      if (firstLink) firstLink.focus();
    };

    const toggleMenu = () => {
      const isOpen = navLinksContainer.classList.contains('open');
      if (isOpen) {
        closeMenu(true);
      } else {
        openMenu();
      }
    };

    hamburger.addEventListener('click', toggleMenu);

    // Escape Key & Focus Trap within Mobile Menu
    document.addEventListener('keydown', (e) => {
      const isOpen = navLinksContainer.classList.contains('open');
      if (!isOpen) return;

      if (e.key === 'Escape') {
        closeMenu(true);
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = [hamburger, ...navLinksContainer.querySelectorAll('a')];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target) && navLinksContainer.classList.contains('open')) {
        closeMenu(false);
      }
    });
  }

  /* ----------------------------------------------------------
     4. Smooth Scroll with Hash & Focus Management
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
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
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
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
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
     9. Stats Counter Animation (Motion-Gated)
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    if (prefersReducedMotion) {
      statNumbers.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        el.textContent = target;
      });
    } else {
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
  }

  /* ----------------------------------------------------------
     10. Contact Form Submission (Real-Time Validation & Async Fetch)
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const fields = {
      name: {
        el: document.getElementById('name'),
        errorEl: document.getElementById('name-error'),
        validate: (val) => val.trim().length > 0 ? '' : 'Please enter your name.'
      },
      email: {
        el: document.getElementById('email'),
        errorEl: document.getElementById('email-error'),
        validate: (val) => {
          if (!val.trim()) return 'Please enter your email address.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
          return '';
        }
      },
      subject: {
        el: document.getElementById('subject'),
        errorEl: document.getElementById('subject-error'),
        validate: (val) => val ? '' : 'Please select a project focus or inquiry.'
      },
      message: {
        el: document.getElementById('message'),
        errorEl: document.getElementById('message-error'),
        validate: (val) => val.trim().length >= 10 ? '' : 'Please provide at least 10 characters of project details.'
      }
    };

    const validateField = (key) => {
      const field = fields[key];
      if (!field || !field.el) return true;
      const errorMsg = field.validate(field.el.value);
      if (errorMsg) {
        field.el.classList.add('error');
        field.el.setAttribute('aria-invalid', 'true');
        if (field.errorEl) {
          field.errorEl.textContent = errorMsg;
          field.errorEl.classList.add('visible');
        }
        return false;
      } else {
        field.el.classList.remove('error');
        field.el.setAttribute('aria-invalid', 'false');
        if (field.errorEl) {
          field.errorEl.textContent = '';
          field.errorEl.classList.remove('visible');
        }
        return true;
      }
    };

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (field.el) {
        field.el.addEventListener('blur', () => validateField(key));
        field.el.addEventListener('input', () => {
          if (field.el.classList.contains('error')) {
            validateField(key);
          }
        });
      }
    });

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      let firstInvalidField = null;
      let formIsValid = true;

      Object.keys(fields).forEach((key) => {
        const isValid = validateField(key);
        if (!isValid) {
          formIsValid = false;
          if (!firstInvalidField && fields[key].el) {
            firstInvalidField = fields[key].el;
          }
        }
      });

      if (!formIsValid) {
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      const btnText = contactForm.querySelector('.btn-text');
      const btnLoading = contactForm.querySelector('.btn-loading');
      const formSuccess = document.getElementById('form-success');
      const formError = document.getElementById('form-error');
      const submitBtn = document.getElementById('btn-submit');

      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline-flex';
      if (submitBtn) submitBtn.disabled = true;
      if (formSuccess) formSuccess.hidden = true;
      if (formError) formError.hidden = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          if (formSuccess) formSuccess.hidden = false;
          contactForm.reset();
          Object.keys(fields).forEach((key) => {
            const field = fields[key];
            if (field.el) {
              field.el.classList.remove('error');
              field.el.removeAttribute('aria-invalid');
            }
            if (field.errorEl) {
              field.errorEl.textContent = '';
              field.errorEl.classList.remove('visible');
            }
          });
        } else {
          throw new Error('Server returned non-200 status');
        }
      } catch (err) {
        if (formError) formError.hidden = false;
      } finally {
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ----------------------------------------------------------
     11. Project Category Filter Tabs (Accessible Tabs + Announcer)
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const announcer = document.getElementById('filter-status-announcer');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            visibleCount++;
            card.style.display = 'flex';
            if (prefersReducedMotion) {
              card.style.opacity = '1';
              card.style.transform = 'none';
            } else {
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              });
            }
          } else {
            if (prefersReducedMotion) {
              card.style.display = 'none';
              card.style.opacity = '0';
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(10px) scale(0.98)';
              setTimeout(() => {
                if (card.style.opacity === '0') {
                  card.style.display = 'none';
                }
              }, 200);
            }
          }
        });

        if (announcer) {
          announcer.textContent = `Showing ${visibleCount} projects for ${btn.textContent.trim()}`;
        }
      });
    });
  }
});
