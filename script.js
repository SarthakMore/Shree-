/* ==========================================================================
   SHREE VENKATESWARA EXPRESS - KOLHAPUR ⇄ PUNE SHARED CABS
   Vanilla JavaScript Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. MOBILE MENU TOGGLE
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. FROM & TO DROPDOWN AUTO-POPULATE OPPOSITE CITY
  const pickupSelect = document.getElementById('pickup-select');
  const dropSelect = document.getElementById('drop-select');

  if (pickupSelect && dropSelect) {
    pickupSelect.addEventListener('change', () => {
      if (pickupSelect.value === 'Kolhapur') {
        dropSelect.value = 'Pune';
      } else if (pickupSelect.value === 'Pune') {
        dropSelect.value = 'Kolhapur';
      }
      validateField(pickupSelect);
      validateField(dropSelect);
    });

    dropSelect.addEventListener('change', () => {
      if (dropSelect.value === 'Kolhapur') {
        pickupSelect.value = 'Pune';
      } else if (dropSelect.value === 'Pune') {
        pickupSelect.value = 'Kolhapur';
      }
      validateField(pickupSelect);
      validateField(dropSelect);
    });
  }

  // 3. DATE PICKER - PREVENT PAST DATES
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today; // Default to today
  }

  // 4. FORM VALIDATION HELPER FUNCTIONS
  function validateField(field) {
    const parent = field.closest('.form-group');
    if (!parent) return true;

    let isValid = true;
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
    } else if (field.type === 'number') {
      const val = parseInt(field.value, 10);
      if (isNaN(val) || val < 1 || val > 12) {
        isValid = false;
      }
    }

    if (!isValid) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
    return isValid;
  }

  // Live input validation on blur / change
  const formInputs = document.querySelectorAll('.form-control');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('change', () => validateField(input));
  });

  // 5. HERO BOOKING FORM SUBMISSION
  const heroBookingForm = document.getElementById('hero-booking-form');
  const formSuccessBanner = document.getElementById('form-success-banner');

  if (heroBookingForm) {
    heroBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputsToValidate = heroBookingForm.querySelectorAll('[required]');
      let formIsValid = true;

      inputsToValidate.forEach(input => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        // Show success confirmation
        if (formSuccessBanner) {
          const fromCity = pickupSelect.value;
          const toCity = dropSelect.value;
          const travelDate = dateInput.value;
          const passCount = document.getElementById('passengers-input').value;

          formSuccessBanner.style.display = 'flex';
          formSuccessBanner.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.25rem;"></i>
            <div>
              <strong>Seat Availability Confirmed!</strong><br>
              ${passCount} seat(s) reserved for ${fromCity} to ${toCity} on ${travelDate}. Our dispatch coordinator will call you shortly.
            </div>
          `;
          formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form
        heroBookingForm.reset();
        if (dateInput) {
          dateInput.value = new Date().toISOString().split('T')[0];
        }
      }
    });
  }

  // 6. FAQ ACCORDION TOGGLE WITH ACCESSIBILITY (ARIA)
  const faqButtons = document.querySelectorAll('.faq-button');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const btn = item.querySelector('.faq-button');
        const content = item.querySelector('.faq-content');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (content) content.style.maxHeight = null;
      });

      // Toggle clicked item if it was not open
      if (!isOpen && faqItem) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        const content = faqItem.querySelector('.faq-content');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });

  // 7. GET A QUOTE MODAL DIALOG
  const quoteModal = document.getElementById('quote-modal');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const quoteForm = document.getElementById('quote-modal-form');

  if (quoteModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quoteModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      quoteModal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && quoteModal.classList.contains('is-open')) {
        closeModal();
      }
    });

    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your outstation quote request has been submitted. We will contact you within 15 minutes.');
        quoteForm.reset();
        closeModal();
      });
    }
  }

});
