/**
 * HG Gongs Consulting Engineers
 */
(function () {
  'use strict';

  const NAV_OFFSET = 88;
  const progress = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');

  const scrollTargets = document.querySelectorAll('[data-section]');
  const navAnchors = document.querySelectorAll('[data-nav]');

  function getCurrentSection() {
    let current = 'home';
    scrollTargets.forEach(function (el) {
      if (el.getBoundingClientRect().top <= NAV_OFFSET) {
        current = el.dataset.section;
      }
    });
    return current;
  }

  function setActiveNav(id) {
    navAnchors.forEach(function (a) {
      a.classList.toggle('is-active', a.dataset.nav === id);
    });
  }

  function onScroll() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && scrollHeight > 0) {
      progress.style.width = (scrollTop / scrollHeight * 100) + '%';
    }
    if (header) {
      header.classList.toggle('is-scrolled', scrollTop > 24);
    }
    setActiveNav(getCurrentSection());
  }

  function scrollToHash(hash, behavior) {
    const target = document.querySelector(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: top, behavior: behavior || 'smooth' });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', function () {
    onScroll();
    if (window.location.hash) scrollToHash(window.location.hash, 'auto');
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function observeAnims(root) {
    (root || document).querySelectorAll('.anim, .anim-scale').forEach(function (el) {
      observer.observe(el);
    });
  }

  function revealAnimsIn(container) {
    if (!container) return;
    container.querySelectorAll('.anim, .anim-scale').forEach(function (el) {
      el.classList.add('is-visible');
      observer.observe(el);
    });
  }

  observeAnims();

  function setMobileMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobileMenu');
    hamburger.addEventListener('click', function () {
      setMobileMenu(!mobileMenu.classList.contains('is-open'));
    });
  }

  window.closeMobile = function () {
    setMobileMenu(false);
  };

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      setMobileMenu(false);
    }
    closeMentorPopup();
  });

  /* Mentorship welcome popup */
  const mentorPopup = document.getElementById('mentorPopup');
  const POPUP_KEY = 'hggongs_mentor_popup_dismissed';

  function openMentorPopup() {
    if (!mentorPopup) return;
    mentorPopup.hidden = false;
    requestAnimationFrame(function () {
      mentorPopup.classList.add('is-open');
      mentorPopup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('popup-open');
    });
  }

  function closeMentorPopup() {
    if (!mentorPopup || !mentorPopup.classList.contains('is-open')) return;
    mentorPopup.classList.remove('is-open');
    mentorPopup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-open');
    try { sessionStorage.setItem(POPUP_KEY, '1'); } catch (err) { /* ignore */ }
    setTimeout(function () {
      if (!mentorPopup.classList.contains('is-open')) mentorPopup.hidden = true;
    }, 400);
  }

  if (mentorPopup) {
    mentorPopup.querySelectorAll('[data-popup-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeMentorPopup();
      });
    });

    const popupCta = document.getElementById('mentorPopupCta');
    if (popupCta) {
      popupCta.addEventListener('click', function (e) {
        e.preventDefault();
        closeMentorPopup();
        setTimeout(function () {
          scrollToHash('#mentorship', 'smooth');
        }, 220);
      });
    }

    var dismissed = false;
    try { dismissed = sessionStorage.getItem(POPUP_KEY) === '1'; } catch (err) { dismissed = false; }

    if (!dismissed && !window.location.hash) {
      setTimeout(openMentorPopup, 900);
    }
  }

  navAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && document.querySelector(href)) {
        e.preventDefault();
        scrollToHash(href, 'smooth');
        window.closeMobile();
      }
    });
  });

  document.querySelectorAll('.faq-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-block');
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-block').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.querySelectorAll('.mentor-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.dataset.tab;
      const panels = document.querySelectorAll('.mentor-tab-panel');
      const tabs = document.querySelectorAll('.mentor-tab');
      var activePanel = null;

      tabs.forEach(function (t) {
        const active = t.dataset.tab === target;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      panels.forEach(function (panel) {
        const active = panel.id === 'tab-' + target;
        panel.classList.toggle('is-active', active);
        if (active) {
          panel.removeAttribute('hidden');
          activePanel = panel;
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      if (activePanel) {
        requestAnimationFrame(function () {
          revealAnimsIn(activePanel);
        });
      }
    });
  });

  const contactForm = document.getElementById('contactForm');
  const contactSubmit = document.getElementById('contactSubmit');
  const formStatus = document.getElementById('formStatus');

  function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.hidden = !message;
    formStatus.textContent = message || '';
    formStatus.classList.remove('is-success', 'is-error');
    if (type) formStatus.classList.add(type);
  }

  if (contactForm && contactSubmit) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (contactForm.querySelector('[name="_honey"]') && contactForm.querySelector('[name="_honey"]').value) {
        return;
      }

      const endpoint = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);

      contactSubmit.textContent = 'Sending…';
      contactSubmit.disabled = true;
      contactSubmit.classList.remove('is-success');
      setFormStatus('');

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error((result.data && result.data.message) || 'Unable to send message.');
          }
          contactForm.reset();
          contactSubmit.textContent = 'Message sent';
          contactSubmit.classList.add('is-success');
          setFormStatus('Thank you — your message was sent to info@hggongsconsulting.co.za.', 'is-success');
          setTimeout(function () {
            contactSubmit.textContent = 'Send message';
            contactSubmit.disabled = false;
            contactSubmit.classList.remove('is-success');
          }, 3200);
        })
        .catch(function () {
          contactSubmit.textContent = 'Send message';
          contactSubmit.disabled = false;
          setFormStatus('Something went wrong. Please email info@hggongsconsulting.co.za directly.', 'is-error');
        });
    });
  }

  /* Who we are — Read more */
  const aboutMore = document.getElementById('aboutMore');
  const aboutToggle = document.getElementById('aboutToggle');
  if (aboutMore && aboutToggle) {
    const aboutLabel = aboutToggle.querySelector('.about-toggle-label');
    aboutToggle.addEventListener('click', function () {
      const open = aboutMore.classList.toggle('is-open');
      aboutToggle.classList.toggle('is-open', open);
      aboutToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (aboutLabel) aboutLabel.textContent = open ? 'Show less' : 'Read more';
    });
  }
})();
