/**
 * Thomani Consulting
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
    if (e.key === 'Escape') {
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        setMobileMenu(false);
      }
      closeMentorPopup();
      closeServiceLightbox();
      closePhotoLightbox();
      return;
    }
    if (photoLightbox && photoLightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPhotoAt(photoIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showPhotoAt(photoIndex + 1);
      }
      return;
    }
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showServiceAt(lightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showServiceAt(lightboxIndex + 1);
    }
  });

  /* Mentorship welcome popup */
  const mentorPopup = document.getElementById('mentorPopup');
  const POPUP_KEY = 'thomani_tender_popup_dismissed';

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
          scrollToHash('#tender-pricing', 'smooth');
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
          setFormStatus('Thank you — your message was sent to info@thomani.co.za.', 'is-success');
          setTimeout(function () {
            contactSubmit.textContent = 'Send message';
            contactSubmit.disabled = false;
            contactSubmit.classList.remove('is-success');
          }, 3200);
        })
        .catch(function () {
          contactSubmit.textContent = 'Send message';
          contactSubmit.disabled = false;
          setFormStatus('Something went wrong. Please email info@thomani.co.za directly.', 'is-error');
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

  /* Services lightbox */
  const serviceCards = Array.prototype.slice.call(document.querySelectorAll('.js-service-card'));
  const lightbox = document.getElementById('serviceLightbox');
  const lightboxImg = document.getElementById('serviceLightboxImg');
  const lightboxTitle = document.getElementById('serviceLightboxTitle');
  const lightboxDesc = document.getElementById('serviceLightboxDesc');
  const lightboxCount = document.getElementById('serviceLightboxCount');
  const lightboxPrev = document.getElementById('serviceLightboxPrev');
  const lightboxNext = document.getElementById('serviceLightboxNext');
  const lightboxInquire = document.getElementById('serviceLightboxInquire');
  let lightboxIndex = 0;
  let touchStartX = 0;

  /* Project photo lightbox */
  const photoLightbox = document.getElementById('photoLightbox');
  const photoLightboxImg = document.getElementById('photoLightboxImg');
  const photoLightboxTitle = document.getElementById('photoLightboxTitle');
  const photoLightboxCount = document.getElementById('photoLightboxCount');
  const photoLightboxPrev = document.getElementById('photoLightboxPrev');
  const photoLightboxNext = document.getElementById('photoLightboxNext');
  let photoItems = [];
  let photoTitle = '';
  let photoIndex = 0;
  let photoTouchStartX = 0;

  function getServiceData(card) {
    const img = card.querySelector('.bento-card-img');
    const title = card.querySelector('h3');
    const desc = card.querySelector('p');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: title ? title.textContent.trim() : '',
      title: title ? title.textContent.trim() : '',
      desc: desc ? desc.textContent.trim() : ''
    };
  }

  function showServiceAt(index) {
    if (!serviceCards.length || !lightbox) return;
    lightboxIndex = (index + serviceCards.length) % serviceCards.length;
    const data = getServiceData(serviceCards[lightboxIndex]);
    if (lightboxImg) {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxDesc) lightboxDesc.textContent = data.desc;
    if (lightboxCount) {
      lightboxCount.textContent = (lightboxIndex + 1) + ' / ' + serviceCards.length;
    }
  }

  function openServiceLightbox(index) {
    if (!lightbox) return;
    showServiceAt(index);
    lightbox.hidden = false;
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    });
  }

  function closeServiceLightbox() {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) lightbox.hidden = true;
    }, 350);
  }

  serviceCards.forEach(function (card, index) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      openServiceLightbox(index);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
      el.addEventListener('click', closeServiceLightbox);
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function () {
      showServiceAt(lightboxIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function () {
      showServiceAt(lightboxIndex + 1);
    });
  }

  if (lightboxInquire) {
    lightboxInquire.addEventListener('click', function (e) {
      e.preventDefault();
      const title = lightboxTitle ? lightboxTitle.textContent.trim() : 'this service';
      closeServiceLightbox();
      setTimeout(function () {
        scrollToHash('#contact', 'smooth');
        const typeSelect = document.getElementById('contact-type');
        const message = document.getElementById('contact-message');
        if (typeSelect) {
          const match = Array.prototype.find.call(typeSelect.options, function (opt) {
            return /tender|engineering|construction|project/i.test(opt.value || opt.text);
          });
          if (match) typeSelect.value = match.value || match.text;
        }
        if (message && !message.value.trim()) {
          message.value = 'I would like to enquire about ' + title + '.';
        }
      }, 220);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (!e.changedTouches || !e.changedTouches.length) return;
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) showServiceAt(lightboxIndex - 1);
      else showServiceAt(lightboxIndex + 1);
    }, { passive: true });
  }

  function showPhotoAt(index) {
    if (!photoItems.length || !photoLightbox) return;
    photoIndex = (index + photoItems.length) % photoItems.length;
    const item = photoItems[photoIndex];
    if (photoLightboxImg) {
      photoLightboxImg.src = item.src;
      photoLightboxImg.alt = item.alt || photoTitle;
    }
    if (photoLightboxTitle) photoLightboxTitle.textContent = photoTitle;
    if (photoLightboxCount) {
      photoLightboxCount.textContent = (photoIndex + 1) + ' / ' + photoItems.length;
    }
  }

  function openPhotoLightbox(items, index, title) {
    if (!photoLightbox || !items || !items.length) return;
    photoItems = items;
    photoTitle = title || 'Project photo';
    showPhotoAt(index);
    photoLightbox.hidden = false;
    requestAnimationFrame(function () {
      photoLightbox.classList.add('is-open');
      photoLightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    });
  }

  function closePhotoLightbox() {
    if (!photoLightbox || !photoLightbox.classList.contains('is-open')) return;
    photoLightbox.classList.remove('is-open');
    photoLightbox.setAttribute('aria-hidden', 'true');
    if (!lightbox || !lightbox.classList.contains('is-open')) {
      document.body.classList.remove('lightbox-open');
    }
    setTimeout(function () {
      if (!photoLightbox.classList.contains('is-open')) photoLightbox.hidden = true;
    }, 350);
  }

  function collectGalleryItems(root, imgSelector) {
    if (!root) return [];
    return Array.prototype.map.call(root.querySelectorAll(imgSelector), function (img) {
      return {
        src: img.currentSrc || img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || ''
      };
    }).filter(function (item) { return !!item.src; });
  }

  function bindGalleryClicks(root, imgSelector, title) {
    if (!root) return;
    const nodes = Array.prototype.slice.call(root.querySelectorAll(imgSelector));
    nodes.forEach(function (img, index) {
      const trigger = img.closest('.steel-collage-item, .materials-slide') || img;
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', 'View photo full screen');
      function openFromTrigger() {
        openPhotoLightbox(collectGalleryItems(root, imgSelector), index, title);
      }
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openFromTrigger();
      });
      trigger.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        openFromTrigger();
      });
    });
  }

  bindGalleryClicks(
    document.getElementById('mwelase-gallery'),
    '.steel-collage-item img',
    'Mwelase steel fixing'
  );
  bindGalleryClicks(
    document.getElementById('materials-gallery'),
    '.materials-slide img',
    'Material testing'
  );

  if (photoLightbox) {
    photoLightbox.querySelectorAll('[data-photo-close]').forEach(function (el) {
      el.addEventListener('click', closePhotoLightbox);
    });
  }
  if (photoLightboxPrev) {
    photoLightboxPrev.addEventListener('click', function () {
      showPhotoAt(photoIndex - 1);
    });
  }
  if (photoLightboxNext) {
    photoLightboxNext.addEventListener('click', function () {
      showPhotoAt(photoIndex + 1);
    });
  }
  if (photoLightbox) {
    photoLightbox.addEventListener('touchstart', function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      photoTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    photoLightbox.addEventListener('touchend', function (e) {
      if (!photoLightbox.classList.contains('is-open')) return;
      if (!e.changedTouches || !e.changedTouches.length) return;
      const delta = e.changedTouches[0].clientX - photoTouchStartX;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) showPhotoAt(photoIndex - 1);
      else showPhotoAt(photoIndex + 1);
    }, { passive: true });
  }

  /* Material testing carousel */
  (function initMaterialsCarousel() {
    const root = document.querySelector('[data-materials-carousel]');
    if (!root) return;

    const track = root.querySelector('[data-materials-track]');
    const slides = Array.prototype.slice.call(root.querySelectorAll('.materials-slide'));
    const prevBtn = root.querySelector('[data-materials-prev]');
    const nextBtn = root.querySelector('[data-materials-next]');
    const dotsWrap = document.querySelector('[data-materials-dots]');
    if (!track || !slides.length) return;

    let activeIndex = 0;
    let raf = 0;

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach(function (_, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'materials-dot' + (i === 0 ? ' is-active' : '');
        btn.setAttribute('aria-label', 'Go to photo ' + (i + 1));
        btn.addEventListener('click', function () {
          scrollToIndex(i);
        });
        dotsWrap.appendChild(btn);
      });
    }

    function setActive(index) {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === activeIndex);
      });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          dot.classList.toggle('is-active', i === activeIndex);
        });
      }
    }

    function scrollToIndex(index) {
      const slide = slides[index];
      if (!slide) return;
      const left = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      setActive(index);
    }

    function updateFromScroll() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let nearestDist = Infinity;
      slides.forEach(function (slide, i) {
        const mid = slide.offsetLeft + slide.clientWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      });
      setActive(nearest);
    }

    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScroll);
    }, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        scrollToIndex(activeIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        scrollToIndex(activeIndex + 1);
      });
    }

    buildDots();
    setActive(0);
  })();
})();
