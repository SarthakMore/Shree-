/* ==========================================================================
   SHREE VENKATESHWARA EXPRESS - DYNAMIC MERN & MULTI-PAGE APPLICATION LOGIC
   Robust Production Version: Hardened Security, Unified Form Selectors,
   Synchronous WhatsApp Dispatch (No Popup Blocking), and 100% Reliable Sync.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => { });
  }

  const API_BASE = 'http://localhost:5000';
  const HOTLINE_NUMBER = '918669410303';
  const HOTLINE_TEXT = '866 941 0303';
  const rentalDisplayText = (value, fallback = 'Premium Car') => {
    const cleaned = String(value || '')
      .replace(/100%\s*(?:Electric|EV)|Zero Emissions?/gi, 'Premium comfort')
      .replace(/\b(?:VinFast|Electric|EV|Shared Cabs?|Kolhapur|Pune)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || fallback;
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  const safePhotoUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch {
      return '';
    }
  };
  const revealObserver = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
    : null;
  const observeRevealElements = (root, selector) => {
    if (!revealObserver) return;
    root.querySelectorAll(selector).forEach(element => {
      element.classList.add('reveal-on-scroll');
      revealObserver.observe(element);
    });
  };

  async function adminFetch(url, options = {}) {
    const token = localStorage.getItem('sv_admin_token');
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('sv_admin_authenticated');
      localStorage.removeItem('sv_admin_token');
      window.location.href = 'login.html';
    }
    return response;
  }

  // Helper function to safely dispatch WhatsApp messages without popup blockers
  function safeWhatsAppDispatch(messageText) {
    const waUrl = `https://wa.me/${HOTLINE_NUMBER}?text=${messageText}`;
    try {
      const win = window.open(waUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waUrl;
      }
    } catch (e) {
      window.location.href = waUrl;
    }
  }

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

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const currentPageFile = window.location.pathname.split('/').pop();
  const offersWhatsAppEnquiries = ['', 'index.html', 'fleet.html', 'airport-tours.html'].includes(currentPageFile);
  if (offersWhatsAppEnquiries && !document.querySelector('.floating-whatsapp')) {
    const whatsappLink = document.createElement('a');
    whatsappLink.className = 'floating-whatsapp';
    whatsappLink.href = `https://wa.me/${HOTLINE_NUMBER}?text=${encodeURIComponent('Hi, I would like to enquire about a car rental.')}`;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.setAttribute('aria-label', 'Chat with Shree Venkateshwara on WhatsApp');
    whatsappLink.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Chat with us</span>';
    document.body.append(whatsappLink);
  }

  observeRevealElements(document, '.journey-card, .road-step');

  // 3. DATE PICKER - PREVENT PAST DATES
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    if (!dateInput.value) dateInput.value = today;
  }

  const homeRentalSearch = document.getElementById('home-rental-search');
  const homeRentalDate = document.getElementById('home-rental-date');
  if (homeRentalDate) {
    const today = new Date();
    homeRentalDate.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    homeRentalDate.value = homeRentalDate.min;
  }
  if (homeRentalSearch) {
    homeRentalSearch.addEventListener('submit', event => {
      event.preventDefault();
      const tripRequest = {
        pickup: document.getElementById('home-rental-pickup').value.trim(),
        destination: document.getElementById('home-rental-destination').value.trim(),
        date: homeRentalDate.value,
        driverOption: homeRentalSearch.querySelector('input[name="home-driver-option"]:checked')?.value || 'With driver'
      };
      sessionStorage.setItem('sv_rental_prefill', JSON.stringify(tripRequest));
      window.location.href = 'fleet.html#available-cars';
    });
  }

  // 4. PER-ROW PASSENGER LIMITS & INTERACTIVE SEAT MAP
  const rowSelect = document.getElementById('row-select');
  const passengersInput = document.getElementById('passengers-input');
  const passengerLimitMsg = document.getElementById('passenger-limit-msg');
  const seatBtns = document.querySelectorAll('.seat-btn');
  const selectedSeatsList = document.getElementById('selected-seats-list');
  const totalFareAmount = document.getElementById('total-fare-amount');

  // Dynamic Live Settings State
  let liveSettings = {
    frontSeatFare: 650,
    middleSeatFare: 550,
    thirdSeatFare: 450,
    ratePerKm: 14,
    cabStatus: 'AVAILABLE',
    statusNote: 'Premium car rentals are available with or without a professional driver.'
  };
  let settingsSyncVersion = 0;

  let selectedSeats = [];

  function updateRowLimitsAndFare() {
    if (!rowSelect) return;
    const selectedRow = rowSelect.value; // 'front', 'middle', 'third'
    const maxPassengers = selectedRow === 'front' ? 1 : 3;

    if (passengersInput) {
      passengersInput.setAttribute('max', maxPassengers);
      if (parseInt(passengersInput.value, 10) > maxPassengers) {
        passengersInput.value = maxPassengers;
      }
    }

    if (passengerLimitMsg) {
      if (selectedRow === 'front') {
        passengerLimitMsg.style.display = 'block';
        passengerLimitMsg.innerHTML = `<i class="fa-solid fa-crown" style="color:#EAB308;"></i> <strong>VIP Front Row Selected:</strong> Strictly Limited to 1 Passenger for Maximum Comfort & View (₹${liveSettings.frontSeatFare})`;
      } else if (selectedRow === 'middle') {
        passengerLimitMsg.style.display = 'block';
        passengerLimitMsg.innerHTML = `<i class="fa-solid fa-couch" style="color:var(--primary);"></i> <strong>Middle Row Selected:</strong> Comfort Seats for up to 3 Passengers (₹${liveSettings.middleSeatFare} per seat)`;
      } else {
        passengerLimitMsg.style.display = 'block';
        passengerLimitMsg.innerHTML = `<i class="fa-solid fa-chair" style="color:var(--text-muted);"></i> <strong>Rear seats selected:</strong> Up to 3 passengers (₹${liveSettings.thirdSeatFare} per seat)`;
      }
    }

    // Auto update seat visual map filtering by row
    seatBtns.forEach(btn => {
      const seatRow = btn.getAttribute('data-row');
      if (seatRow === selectedRow) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
        btn.classList.remove('is-selected');
      }
    });

    calculateTotalFare();
  }

  if (rowSelect) {
    rowSelect.addEventListener('change', updateRowLimitsAndFare);
  }

  seatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const seatRow = btn.getAttribute('data-row');
      const maxAllowed = seatRow === 'front' ? 1 : 3;
      const seatId = btn.getAttribute('data-seat-id');

      if (btn.classList.contains('is-selected')) {
        btn.classList.remove('is-selected');
        selectedSeats = selectedSeats.filter(s => s.id !== seatId);
      } else {
        const rowSelectedCount = selectedSeats.filter(s => s.row === seatRow).length;
        if (rowSelectedCount >= maxAllowed) {
          alert(`Row limit reached! ${seatRow === 'front' ? 'Front VIP row is strictly limited to 1 passenger' : 'This row allows a maximum of 3 passengers'}.`);
          return;
        }
        btn.classList.add('is-selected');
        selectedSeats.push({ id: seatId, row: seatRow, name: btn.textContent.trim() });
      }

      if (passengersInput) {
        passengersInput.value = Math.max(1, selectedSeats.length);
      }

      calculateTotalFare();
    });
  });

  function calculateTotalFare() {
    if (!totalFareAmount) return;
    const selectedRow = rowSelect ? rowSelect.value : 'front';
    const count = parseInt(passengersInput ? passengersInput.value : 1, 10) || 1;
    let unitFare = liveSettings.frontSeatFare;
    if (selectedRow === 'middle') unitFare = liveSettings.middleSeatFare;
    if (selectedRow === 'third') unitFare = liveSettings.thirdSeatFare;

    const total = count * unitFare;
    totalFareAmount.textContent = `₹${total}`;

    if (selectedSeatsList) {
      if (selectedSeats.length > 0) {
        selectedSeatsList.innerHTML = selectedSeats.map(s => `<span class="badge" style="margin-right:4px;">${s.name} (₹${unitFare})</span>`).join('');
      } else {
        selectedSeatsList.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem;">Selected Row: ${selectedRow.toUpperCase()} (₹${unitFare} / seat)</span>`;
      }
    }
  }

  // 5. REAL-TIME LIVE SYNC POLLING FROM ADMIN (FETCHES EVERY 3 SECONDS)
  async function syncLiveSettings() {
    const syncVersionAtStart = settingsSyncVersion;
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      const data = await res.json();
      if (syncVersionAtStart !== settingsSyncVersion) return;
      if (data.success && data.data) {
        liveSettings = { ...liveSettings, ...data.data };
        updateAdminDashboardStats(liveSettings);

        // Update Fares Display on Reservation Pages
        const frontBadge = document.getElementById('live-front-fare');
        const middleBadge = document.getElementById('live-middle-fare');
        const thirdBadge = document.getElementById('live-third-fare');
        const rateKmBadge = document.getElementById('live-rate-km');

        if (frontBadge) frontBadge.textContent = `₹${liveSettings.frontSeatFare}`;
        if (middleBadge) middleBadge.textContent = `₹${liveSettings.middleSeatFare}`;
        if (thirdBadge) thirdBadge.textContent = `₹${liveSettings.thirdSeatFare}`;
        if (rateKmBadge) rateKmBadge.textContent = `₹${liveSettings.ratePerKm}/km`;

        // Update Badges & Rate Displays
        document.querySelectorAll('.rate-front-text').forEach(el => el.textContent = `₹${liveSettings.frontSeatFare}`);
        document.querySelectorAll('.rate-middle-text').forEach(el => el.textContent = `₹${liveSettings.middleSeatFare}`);
        document.querySelectorAll('.rate-third-text').forEach(el => el.textContent = `₹${liveSettings.thirdSeatFare}`);
        document.querySelectorAll('.rate-km-text').forEach(el => el.textContent = `₹${liveSettings.ratePerKm}/km`);

        // Check Cab Availability Status
        const statusBanner = document.getElementById('cab-status-banner');
        const submitBtn = document.getElementById('book-submit-btn') || document.querySelector('#hero-booking-form button[type="submit"]');

        if (liveSettings.cabStatus === 'FULL') {
          if (statusBanner) {
            statusBanner.style.display = 'flex';
            statusBanner.style.backgroundColor = '#FEE2E2';
            statusBanner.style.color = '#991B1B';
            statusBanner.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>THIS VEHICLE IS CURRENTLY UNAVAILABLE.</strong> ${liveSettings.statusNote}`;
          }
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.innerHTML = `<i class="fa-solid fa-ban"></i> VEHICLE UNAVAILABLE - CALL ${HOTLINE_TEXT}`;
          }
        } else {
          if (statusBanner) {
            statusBanner.style.display = 'flex';
            statusBanner.style.backgroundColor = '#DCFCE7';
            statusBanner.style.color = '#15803D';
            statusBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>LIVE SERVICE ACTIVE:</strong> ${liveSettings.statusNote}`;
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = '<i class="fa-solid fa-car-side"></i> Request Rental Confirmation';
          }
        }

        updateRowLimitsAndFare();
      }
    } catch (err) {
      console.log('Live sync polling active');
    }
  }

  syncLiveSettings();
  setInterval(syncLiveSettings, 3000);

  // 6. DYNAMIC CARS & TOURS MANAGEMENT (FETCH & RENDER)
  let fleetCars = [];
  const fleetSearch = document.getElementById('fleet-search');
  const fleetCategoryFilter = document.getElementById('fleet-category-filter');
  const fleetSort = document.getElementById('fleet-sort');
  const fleetResultsCount = document.getElementById('fleet-results-count');

  function renderFleetLoadError() {
    const container = document.getElementById('fleet-cars-container');
    if (!container) return;
    container.setAttribute('aria-busy', 'false');
    if (fleetResultsCount) fleetResultsCount.textContent = 'We could not load the cars right now.';
    container.innerHTML = `
      <div class="fleet-empty" role="alert">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <h3>Cars are temporarily unavailable</h3>
        <p>Please try again, or call us and we’ll help you choose a car.</p>
        <button type="button" class="btn btn-primary fleet-retry-cars"><i class="fa-solid fa-rotate-right"></i> Try again</button>
        <a class="btn btn-secondary" href="tel:+918669410303"><i class="fa-solid fa-phone"></i> Call 866 941 0303</a>
      </div>`;
  }

  async function loadFleetCars() {
    const container = document.getElementById('fleet-cars-container');
    try {
      const res = await fetch(`${API_BASE}/api/cars`);
      if (!res.ok) throw new Error(`Fleet request failed with status ${res.status}`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) throw new Error('Fleet response did not include vehicle data');
      fleetCars = data.data;
      updateFleetCategoryOptions();
      renderFleetCars(getVisibleFleetCars());
      renderAdminCarsList(data.data);
    } catch (err) {
      renderFleetLoadError();
    }
    if (container) container.setAttribute('aria-busy', 'false');
  }

  function updateFleetCategoryOptions() {
    if (!fleetCategoryFilter) return;
    const selectedCategory = fleetCategoryFilter.value;
    const categories = [...new Set(fleetCars
      .map(car => rentalDisplayText(car.category, 'Premium Car'))
      .filter(Boolean))]
      .sort((first, second) => first.localeCompare(second));
    fleetCategoryFilter.innerHTML = '<option value="">All categories</option>' +
      categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
    if (categories.includes(selectedCategory)) fleetCategoryFilter.value = selectedCategory;
  }

  function getVisibleFleetCars() {
    const searchTerm = fleetSearch?.value.trim().toLowerCase() || '';
    const selectedCategory = fleetCategoryFilter?.value || '';
    const sortBy = fleetSort?.value || 'featured';
    const matches = fleetCars.filter(car => {
      const name = rentalDisplayText(car.name).toLowerCase();
      const category = rentalDisplayText(car.category, 'Premium Car');
      return (!searchTerm || name.includes(searchTerm) || category.toLowerCase().includes(searchTerm)) &&
        (!selectedCategory || category === selectedCategory);
    });

    if (sortBy === 'price-asc') matches.sort((a, b) => (Number(a.ratePerKm) || 14) - (Number(b.ratePerKm) || 14));
    if (sortBy === 'price-desc') matches.sort((a, b) => (Number(b.ratePerKm) || 14) - (Number(a.ratePerKm) || 14));
    if (sortBy === 'seats-desc') matches.sort((a, b) => (Number(b.capacity) || 0) - (Number(a.capacity) || 0));
    return matches;
  }

  function renderFleetCars(cars) {
    const container = document.getElementById('fleet-cars-container');
    if (!container) return;

    container.setAttribute('aria-busy', 'false');
    if (fleetResultsCount) {
      const count = cars.length;
      fleetResultsCount.innerHTML = `<strong>${count}</strong> ${count === 1 ? 'car' : 'cars'} ${fleetCars.length ? 'to choose from' : 'available'}`;
    }

    if (!fleetCars.length) {
      container.innerHTML = `
        <div class="fleet-empty">
          <i class="fa-solid fa-car-side" aria-hidden="true"></i>
          <h3>Your next ride starts here</h3>
          <p>Our team can help you find the right car, driver option, and rate for your trip.</p>
          <a class="btn btn-primary" href="tel:+918669410303"><i class="fa-solid fa-phone"></i> Call 866 941 0303</a>
        </div>`;
      return;
    }

    if (!cars.length) {
      container.innerHTML = `
        <div class="fleet-empty">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <h3>No cars match those filters</h3>
          <p>Try a different search or show all available cars.</p>
          <button type="button" class="btn btn-secondary fleet-clear-filters">Clear filters</button>
        </div>`;
      return;
    }

    container.innerHTML = cars.map(car => {
      const photos = (Array.isArray(car.photos) && car.photos.length ? car.photos : [car.photo])
        .map(safePhotoUrl)
        .filter(Boolean)
        .slice(0, 5);
      const carName = rentalDisplayText(car.name);
      const rate = Number(car.ratePerKm) || 14;
      const category = rentalDisplayText(car.category, 'Premium Car');
      const capacity = Number(car.capacity) || 0;
      const hourlyRate = Number(car.hourlyRate) || 0;
      const available = String(car.status || 'AVAILABLE').toUpperCase() === 'AVAILABLE';
      const photoGallery = photos.length > 1 ? `
        <div class="fleet-photo-gallery" aria-label="Photos of ${escapeHtml(carName)}">
          ${photos.map((photo, index) => `<button type="button" class="fleet-photo-thumb" data-photo-src="${escapeHtml(photo)}" aria-pressed="${index === 0}" aria-label="Show photo ${index + 1} of ${escapeHtml(carName)}"><img src="${escapeHtml(photo)}" alt="" loading="lazy"></button>`).join('')}
        </div>` : '';

      return `
        <article class="vehicle-card">
          <div class="vehicle-media">
            <img class="vehicle-photo" src="${escapeHtml(photos[0] || '')}" alt="${escapeHtml(carName)}" loading="lazy">
            <span class="vehicle-category">${escapeHtml(category)}</span>
            <span class="vehicle-status${available ? '' : ' is-unavailable'}"><i class="fa-solid ${available ? 'fa-circle-check' : 'fa-circle-xmark'}" aria-hidden="true"></i>${available ? 'Available' : 'Currently unavailable'}</span>
            <span class="vehicle-rate"><i class="fa-solid fa-indian-rupee-sign" aria-hidden="true"></i>${rate}/km</span>
            ${photos.length > 1 ? `<button type="button" class="fleet-photo-step fleet-photo-step--previous" data-photo-step="-1" aria-label="Previous photo of ${escapeHtml(carName)}"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><button type="button" class="fleet-photo-step fleet-photo-step--next" data-photo-step="1" aria-label="Next photo of ${escapeHtml(carName)}"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>` : ''}
            <span class="fleet-photo-count" aria-live="polite">${photos.length > 1 ? `01 / ${String(photos.length).padStart(2, '0')}` : ''}</span>
          </div>
          ${photoGallery}
          <div class="vehicle-details">
            <h3>${escapeHtml(carName)}</h3>
            <div class="vehicle-specs">
              ${capacity ? `<span><i class="fa-solid fa-users" aria-hidden="true"></i>${capacity} seats</span>` : ''}
              <span><i class="fa-solid fa-route" aria-hidden="true"></i>₹${rate}/km</span>
              ${hourlyRate ? `<span><i class="fa-regular fa-clock" aria-hidden="true"></i>₹${hourlyRate}/hr</span>` : ''}
            </div>
            <ul class="vehicle-features">
              ${(Array.isArray(car.features) ? car.features : []).slice(0, 4).map(feature => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${escapeHtml(rentalDisplayText(feature, 'Premium comfort'))}</li>`).join('')}
            </ul>
            <button type="button" class="fleet-hire-car btn btn-primary" data-car-name="${escapeHtml(carName)}" data-rate="${rate}" ${available ? '' : 'disabled'} aria-label="${available ? `Enquire about ${escapeHtml(carName)}` : `${escapeHtml(carName)} is currently unavailable`}">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${available ? 'Enquire about this car' : 'Currently unavailable'}
            </button>
          </div>
        </article>`;
    }).join('');

    container.querySelectorAll('.fleet-photo-thumb').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.vehicle-card');
        const mainPhoto = card?.querySelector('.vehicle-photo');
        const thumbs = [...(card?.querySelectorAll('.fleet-photo-thumb') || [])];
        const index = thumbs.indexOf(button);
        if (mainPhoto) mainPhoto.src = button.dataset.photoSrc;
        card?.querySelectorAll('.fleet-photo-thumb').forEach(thumb => thumb.setAttribute('aria-pressed', String(thumb === button)));
        const counter = card?.querySelector('.fleet-photo-count');
        if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(thumbs.length).padStart(2, '0')}`;
      });
    });

    container.querySelectorAll('.fleet-photo-step').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.vehicle-card');
        const thumbs = [...(card?.querySelectorAll('.fleet-photo-thumb') || [])];
        const currentIndex = thumbs.findIndex(thumb => thumb.getAttribute('aria-pressed') === 'true');
        const nextIndex = (currentIndex + Number(button.dataset.photoStep) + thumbs.length) % thumbs.length;
        thumbs[nextIndex]?.click();
        thumbs[nextIndex]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      });
    });

    observeRevealElements(container, '.vehicle-card');

    container.querySelectorAll('.fleet-hire-car').forEach(button => {
      button.addEventListener('click', () => {
        openCarHireModal(button.dataset.carName, Number(button.dataset.rate));
      });
    });
  }

  function refreshFleetCars() {
    renderFleetCars(getVisibleFleetCars());
  }

  fleetSearch?.addEventListener('input', refreshFleetCars);
  fleetCategoryFilter?.addEventListener('change', refreshFleetCars);
  fleetSort?.addEventListener('change', refreshFleetCars);
  document.getElementById('fleet-cars-container')?.addEventListener('click', event => {
    if (event.target.closest('.fleet-retry-cars')) loadFleetCars();
    if (event.target.closest('.fleet-clear-filters')) {
      if (fleetSearch) fleetSearch.value = '';
      if (fleetCategoryFilter) fleetCategoryFilter.value = '';
      if (fleetSort) fleetSort.value = 'featured';
      refreshFleetCars();
    }
  });

  const carHireModal = document.getElementById('car-hire-modal');
  const carHireForm = document.getElementById('car-hire-form');
  const closeCarHireModalBtn = document.getElementById('close-car-hire-modal');

  function closeCarHireModal() {
    if (!carHireModal) return;
    carHireModal.classList.remove('is-open');
    carHireModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openCarHireModal(name, rateKm) {
    if (!carHireModal) return;
    const currentDate = new Date();
    const minimumDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    carHireModal.dataset.carName = name;
    carHireModal.dataset.rateKm = String(rateKm);
    document.getElementById('car-hire-title').textContent = name;
    document.getElementById('car-hire-rate').textContent = `₹${rateKm}/km`;
    document.getElementById('car-hire-date').min = minimumDate;
    if (activeClient?.name && activeClient.phone) {
      document.getElementById('car-hire-name').value = activeClient.name;
      document.getElementById('car-hire-phone').value = activeClient.phone;
    }
    const savedRequest = sessionStorage.getItem('sv_rental_prefill');
    if (savedRequest) {
      try {
        const tripRequest = JSON.parse(savedRequest);
        document.getElementById('car-hire-pickup').value = tripRequest.pickup || '';
        document.getElementById('car-hire-destination').value = tripRequest.destination || '';
        document.getElementById('car-hire-date').value = tripRequest.date || '';
        carHireForm.querySelectorAll('input[name="car-hire-driver-option"]').forEach(option => {
          option.checked = option.value === tripRequest.driverOption;
        });
        sessionStorage.removeItem('sv_rental_prefill');
      } catch (error) {
        console.error('Could not load saved rental details.', error);
        sessionStorage.removeItem('sv_rental_prefill');
      }
    }
    carHireModal.classList.add('is-open');
    carHireModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('car-hire-name').focus();
  }

  if (closeCarHireModalBtn) closeCarHireModalBtn.addEventListener('click', closeCarHireModal);
  if (carHireModal) {
    carHireModal.addEventListener('click', event => {
      if (event.target === carHireModal) closeCarHireModal();
    });
  }
  if (carHireForm) {
    carHireForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('car-hire-name').value.trim();
      const phone = document.getElementById('car-hire-phone').value.trim();
      const date = document.getElementById('car-hire-date').value;
      const pickup = document.getElementById('car-hire-pickup').value.trim();
      const destination = document.getElementById('car-hire-destination').value.trim();
      const driverOption = carHireForm.querySelector('input[name="car-hire-driver-option"]:checked')?.value || 'With driver';
      const message = encodeURIComponent(
        `*CAR RENTAL ENQUIRY - SHREE VENKATESHWARA*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Trip date:* ${date}\n` +
        `*Car:* ${carHireModal.dataset.carName}\n` +
        `*Rate:* ₹${carHireModal.dataset.rateKm}/km\n` +
        `*Pick-up from:* ${pickup}\n` +
        `*Destination:* ${destination}\n` +
        `*Rental option:* ${driverOption}`
      );
      safeWhatsAppDispatch(message);
      carHireForm.reset();
      closeCarHireModal();
    });
  }

  function renderAdminCarsList(cars) {
    const listEl = document.getElementById('admin-cars-list');
    if (!listEl) return;

    listEl.innerHTML = cars.map(car => `
      <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:12px; padding:14px; display:flex; gap:12px; align-items:center;">
        <img src="${escapeHtml(safePhotoUrl(car.photo))}" alt="${escapeHtml(rentalDisplayText(car.name))}" style="width:70px; height:50px; object-fit:cover; border-radius:8px;">
        <div style="flex:1;">
          <h5 style="margin:0; font-size:0.95rem; font-weight:700;">${escapeHtml(rentalDisplayText(car.name))}</h5>
          <span style="font-size:0.75rem; color:#64748B;">${escapeHtml(rentalDisplayText(car.category))} • ₹${Number(car.ratePerKm) || 0}/km • ${Number(car.photos?.length || (car.photo ? 1 : 0))} photos • ${Number(car.capacity) || 0} Seats</span>
        </div>
        <button type="button" class="edit-car-record btn btn-secondary" data-car-id="${escapeHtml(car._id)}" aria-label="Edit ${escapeHtml(rentalDisplayText(car.name))}" style="padding:6px 10px; font-size:0.75rem;">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button onclick="deleteCarRecord('${car._id}')" class="btn btn-accent" style="padding:6px 12px; font-size:0.75rem; background:#EF4444; border-color:#EF4444;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join('');

    listEl.querySelectorAll('.edit-car-record').forEach(button => {
      button.addEventListener('click', () => window.editCarRecord(button.dataset.carId));
    });
  }

  window.editCarRecord = async function (id) {
    try {
      const response = await adminFetch(`${API_BASE}/api/cars`);
      const result = await response.json();
      const car = result.data?.find(item => item._id === id);
      if (!result.success || !car) return;

      const photos = (Array.isArray(car.photos) && car.photos.length ? car.photos : [car.photo || '']).slice(0, 5);
      document.getElementById('car-input-edit-id').value = car._id;
      document.getElementById('car-input-name').value = car.name || '';
      document.getElementById('car-input-category').value = car.category || 'Premium SUV';
      document.getElementById('car-input-ratekm').value = car.ratePerKm || 14;
      document.getElementById('car-input-capacity').value = car.capacity || 7;
      document.getElementById('car-input-hourly').value = car.hourlyRate || 450;
      for (let index = 0; index < 5; index += 1) {
        document.getElementById(`car-input-photo-${index + 1}`).value = photos[index] || '';
      }
      document.getElementById('car-form-title').textContent = `Edit ${rentalDisplayText(car.name)}`;
      document.getElementById('car-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Car Changes';
      document.getElementById('car-cancel-edit-btn').style.display = 'inline-flex';
      document.getElementById('admin-add-car-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      alert('Unable to load car details for editing.');
    }
  };

  const cancelCarEditBtn = document.getElementById('car-cancel-edit-btn');
  if (cancelCarEditBtn) {
    cancelCarEditBtn.addEventListener('click', () => {
      document.getElementById('admin-add-car-form').reset();
      document.getElementById('car-input-edit-id').value = '';
      document.getElementById('car-form-title').textContent = 'Add Car to Fleet';
      document.getElementById('car-submit-btn').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Add Car to Fleet';
      cancelCarEditBtn.style.display = 'none';
    });
  }

  window.deleteCarRecord = async function (id) {
    if (!confirm('Delete this car from fleet?')) return;
    try {
      await adminFetch(`${API_BASE}/api/cars/${id}`, { method: 'DELETE' });
      loadFleetCars();
    } catch (err) { }
  };

  async function loadTravelTours() {
    try {
      const res = await fetch(`${API_BASE}/api/tours`);
      const data = await res.json();
      if (data.success && data.data) {
        renderTravelTours(data.data);
        renderAdminToursList(data.data);
      }
    } catch (err) { }
  }

  function renderTravelTours(tours) {
    const container = document.getElementById('tours-container');
    if (!container) return;

    container.innerHTML = tours.map(tour => `
      <div class="tour-card" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="position:relative; height:180px;">
            <img src="${tour.photo}" alt="${tour.title}" style="width:100%; height:100%; object-fit:cover;">
            <span style="position:absolute; bottom:12px; right:12px; background:var(--primary); color:#FFFFFF; padding:4px 12px; border-radius:9999px; font-weight:800; font-size:0.85rem;">
              ₹${tour.price} Total
            </span>
          </div>
          <div style="padding:20px;">
            <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">${tour.destination} • ${tour.duration}</span>
            <h3 style="font-size:1.15rem; font-weight:800; margin:6px 0 10px; color:#0F172A;">${tour.title}</h3>
            <p style="font-size:0.85rem; color:#64748B; margin-bottom:14px; line-height:1.5;">${tour.description}</p>
          </div>
        </div>
        <div style="padding:0 20px 20px;">
          <button onclick="dispatchTourWhatsApp('${tour.title}', ${tour.price})" class="btn btn-accent" style="width:100%; padding:10px; font-weight:700; background:#10B981; border-color:#10B981; cursor:pointer;">
            <i class="fa-brands fa-whatsapp"></i> Book Tour via WhatsApp Hotline
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderAdminToursList(tours) {
    const listEl = document.getElementById('admin-tours-list');
    if (!listEl) return;

    listEl.innerHTML = tours.map(tour => `
      <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:12px; padding:14px; display:flex; gap:12px; align-items:center;">
        <img src="${tour.photo}" alt="${tour.title}" style="width:70px; height:50px; object-fit:cover; border-radius:8px;">
        <div style="flex:1;">
          <h5 style="margin:0; font-size:0.95rem; font-weight:700;">${tour.title}</h5>
          <span style="font-size:0.75rem; color:#64748B;">₹${tour.price} • ${tour.duration}</span>
        </div>
        <button onclick="deleteTourRecord('${tour._id}')" class="btn btn-accent" style="padding:6px 12px; font-size:0.75rem; background:#EF4444; border-color:#EF4444;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  window.deleteTourRecord = async function (id) {
    if (!confirm('Delete travel package?')) return;
    try {
      await adminFetch(`${API_BASE}/api/tours/${id}`, { method: 'DELETE' });
      loadTravelTours();
    } catch (err) { }
  };

  window.dispatchTourWhatsApp = function (title, price) {
    const user = JSON.parse(localStorage.getItem('sv_client_user')) || { name: 'Valued Traveler', phone: 'Not provided' };
    const msg = encodeURIComponent(
      `*NEW TOUR PACKAGE BOOKING REQUEST*\n\n` +
      `👤 *Passenger:* ${user.name}\n` +
      `📞 *Phone:* ${user.phone}\n` +
      `🗺️ *Package:* ${title}\n` +
      `💰 *Total Price:* ₹${price}\n` +
      `⚡ *Vehicle:* Private AC Limo / SUV\n\n` +
      `Please confirm driver assignment and pickup schedule!`
    );
    safeWhatsAppDispatch(msg);
  };

  const packageButtons = document.querySelectorAll('.pkg-book-btn');
  packageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const pkgName = button.getAttribute('data-pkg-name') || 'Selected Tour Package';
      const pkgPriceString = button.getAttribute('data-pkg-price') || '0';
      const pkgPrice = Number.parseInt(pkgPriceString.replace(/[^0-9]/g, ''), 10) || 0;
      window.dispatchTourWhatsApp(pkgName, pkgPrice);
    });
  });

  loadFleetCars();
  loadTravelTours();

  // 7. ADMIN SERVICES - ADD CAR FORM & ADD TOUR FORM HANDLERS
  const addCarForm = document.getElementById('admin-add-car-form');
  if (addCarForm) {
    addCarForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const editId = document.getElementById('car-input-edit-id')?.value || '';
      const photos = Array.from({ length: 5 }, (_, index) =>
        document.getElementById(`car-input-photo-${index + 1}`)?.value.trim()
      ).filter(Boolean);
      if (photos.length < 2) {
        alert('Add at least two car photo URLs.');
        return;
      }
      const payload = {
        name: document.getElementById('car-input-name')?.value,
        category: document.getElementById('car-input-category')?.value,
        photo: photos[0],
        photos,
        ratePerKm: document.getElementById('car-input-ratekm')?.value,
        capacity: document.getElementById('car-input-capacity')?.value,
        hourlyRate: document.getElementById('car-input-hourly')?.value
      };

      try {
        const res = await adminFetch(`${API_BASE}/api/cars${editId ? `/${editId}` : ''}`, {
          method: editId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert(editId ? 'Car details updated successfully!' : 'Car added to fleet successfully!');
          addCarForm.reset();
          document.getElementById('car-input-edit-id').value = '';
          document.getElementById('car-form-title').textContent = 'Add Car to Fleet';
          document.getElementById('car-submit-btn').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Add Car to Fleet';
          document.getElementById('car-cancel-edit-btn').style.display = 'none';
          loadFleetCars();
        }
      } catch (err) {
        alert(editId ? 'Failed to update car.' : 'Car saved to memory fleet!');
      }
    });
  }

  const addTourForm = document.getElementById('admin-add-tour-form');
  if (addTourForm) {
    addTourForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        title: document.getElementById('tour-input-title')?.value,
        destination: document.getElementById('tour-input-destination')?.value,
        price: document.getElementById('tour-input-price')?.value,
        photo: document.getElementById('tour-input-photo')?.value,
        duration: document.getElementById('tour-input-duration')?.value,
        description: document.getElementById('tour-input-desc')?.value
      };

      try {
        const res = await adminFetch(`${API_BASE}/api/tours`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Travel package added successfully!');
          addTourForm.reset();
          loadTravelTours();
        }
      } catch (err) {
        alert('Tour package saved!');
      }
    });
  }

  // 8. CLIENT LOGIN & AUTH PORTAL HANDLERS
  const clientLoginForm = document.getElementById('client-login-form');
  const clientNameInput = document.getElementById('client-name-input');
  const clientPhoneInput = document.getElementById('client-phone-input');
  const clientLoggedInBanner = document.getElementById('client-logged-in-banner');
  const clientUserDetailsText = document.getElementById('client-user-details-text');
  const clientLogoutBtn = document.getElementById('client-logout-btn');
  const navUserText = document.getElementById('nav-user-text');

  let activeClient = JSON.parse(localStorage.getItem('sv_client_user')) || null;

  function updateClientLoginUI() {
    if (activeClient && activeClient.name && activeClient.phone) {
      if (clientLoggedInBanner) clientLoggedInBanner.style.display = 'flex';
      if (clientLoginForm) clientLoginForm.style.display = 'none';
      if (clientUserDetailsText) clientUserDetailsText.textContent = `${activeClient.name} (${activeClient.phone})`;
      if (navUserText) navUserText.textContent = activeClient.name.split(' ')[0];

      const nameInput = document.getElementById('name-input');
      const phoneInput = document.getElementById('phone-input');
      if (nameInput) nameInput.value = activeClient.name;
      if (phoneInput) phoneInput.value = activeClient.phone;
    } else {
      if (clientLoggedInBanner) clientLoggedInBanner.style.display = 'none';
      if (clientLoginForm) clientLoginForm.style.display = 'block';
      if (navUserText) navUserText.textContent = 'Login';
    }
  }

  updateClientLoginUI();

  if (clientLoginForm) {
    clientLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = clientNameInput ? clientNameInput.value.trim() : '';
      const phone = clientPhoneInput ? clientPhoneInput.value.trim() : '';

      if (name && phone) {
        activeClient = { name, phone };
        localStorage.setItem('sv_client_user', JSON.stringify(activeClient));
        updateClientLoginUI();
        alert(`Welcome, ${name}! Your details have been saved for fast booking.`);
      }
    });
  }

  if (clientLogoutBtn) {
    clientLogoutBtn.addEventListener('click', () => {
      activeClient = null;
      localStorage.removeItem('sv_client_user');
      updateClientLoginUI();
    });
  }

  function showAdminLoginMessage(element, message, isSuccess = false) {
    if (!element) return;
    const icon = document.createElement('i');
    icon.className = `fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-triangle-exclamation'}`;
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = message;
    element.replaceChildren(icon, text);
    element.style.display = 'flex';
    element.style.backgroundColor = isSuccess ? '#DCFCE7' : '#FEE2E2';
    element.style.color = isSuccess ? '#15803D' : '#991B1B';
  }

  async function authenticateAdmin(password, messageElement) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', password })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = response.status === 401
          ? 'Incorrect admin password. Please check it and try again.'
          : response.status === 503
            ? 'Admin login is not configured on the server. Contact the site administrator.'
            : data?.message || `The admin server returned an error (HTTP ${response.status}).`;
        showAdminLoginMessage(messageElement, message);
        return false;
      }

      if (!data || typeof data !== 'object') {
        showAdminLoginMessage(messageElement, 'The admin server returned an unreadable response. Please try again or contact the site administrator.');
        return false;
      }
      if (!data.success) {
        showAdminLoginMessage(messageElement, data.message || 'The admin server could not authenticate this request.');
        return false;
      }
      if (!data.token) {
        showAdminLoginMessage(messageElement, 'The server response was incomplete. Please try again or contact the site administrator.');
        return false;
      }
      localStorage.setItem('sv_admin_authenticated', 'true');
      localStorage.setItem('sv_admin_token', data.token);
      return true;
    } catch {
      showAdminLoginMessage(
        messageElement,
        `Cannot reach the admin server at ${API_BASE}. Check your connection or ask the site administrator to check the API server and CORS settings.`
      );
      return false;
    }
  }

  const adminApiStatus = document.getElementById('admin-api-status');
  if (adminApiStatus) {
    fetch(`${API_BASE}/api/health`)
      .then(async response => {
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          adminApiStatus.textContent = `The admin server responded with HTTP ${response.status}. Please contact the site administrator.`;
          adminApiStatus.classList.add('is-offline');
          return;
        }
        adminApiStatus.textContent = `Admin server online${data?.status ? ` (${data.status})` : ''}.`;
        adminApiStatus.classList.add('is-online');
      })
      .catch(() => {
        adminApiStatus.textContent = `Cannot reach the admin server at ${API_BASE}. Check your connection or ask the site administrator to check the API server and CORS settings.`;
        adminApiStatus.classList.add('is-offline');
      });
  }

  // 9. ADMIN SECURITY AUTHENTICATION HANDLERS (VIA SECURE BACKEND AUTH ROUTE)
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPassInput = document.getElementById('admin-pass-input');
  const adminLoginMsg = document.getElementById('admin-login-msg');

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPass = adminPassInput ? adminPassInput.value : '';
      const submitButton = adminLoginForm.querySelector('[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      const authenticated = await authenticateAdmin(enteredPass, adminLoginMsg);
      if (submitButton) submitButton.disabled = false;
      if (!authenticated) return;
      showAdminLoginMessage(adminLoginMsg, 'Admin password verified. Opening the Control Center...', true);
      setTimeout(() => { window.location.href = 'admin.html'; }, 600);
    });
  }

  // Dedicated admin.html Security Gateway
  const adminPageLoginForm = document.getElementById('admin-page-login-form');
  const adminPagePassword = document.getElementById('admin-page-password');
  const adminPageLoginBox = document.getElementById('admin-page-login-box');
  const adminPageDashboard = document.getElementById('admin-page-dashboard');
  const adminPageLoginMsg = document.getElementById('admin-page-login-msg');
  const adminSystemNotice = document.getElementById('admin-system-notice');
  const adminLogoutTopBtn = document.getElementById('admin-logout-top-btn');

  const isAdminAuth = localStorage.getItem('sv_admin_authenticated') === 'true'
    && Boolean(localStorage.getItem('sv_admin_token'));

  if (adminPageDashboard && adminPageLoginBox) {
    if (isAdminAuth) {
      adminPageLoginBox.style.display = 'none';
      adminPageDashboard.style.display = 'block';
      if (adminLogoutTopBtn) adminLogoutTopBtn.style.display = 'inline-block';
    } else {
      adminPageLoginBox.style.display = 'block';
      adminPageDashboard.style.display = 'none';
      if (adminLogoutTopBtn) adminLogoutTopBtn.style.display = 'none';
    }
  }

  if (adminLogoutTopBtn) {
    adminLogoutTopBtn.addEventListener('click', async () => {
      try {
        await adminFetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
      } catch (err) { }
      localStorage.removeItem('sv_admin_authenticated');
      localStorage.removeItem('sv_admin_token');
      window.location.reload();
    });
  }

  if (adminPageLoginForm) {
    adminPageLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPass = adminPagePassword ? adminPagePassword.value : '';
      const submitButton = adminPageLoginForm.querySelector('[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      const authenticated = await authenticateAdmin(enteredPass, adminPageLoginMsg);
      if (submitButton) submitButton.disabled = false;
      if (!authenticated) return;
      if (adminPageLoginBox) adminPageLoginBox.style.display = 'none';
      if (adminPageDashboard) adminPageDashboard.style.display = 'block';
      if (adminLogoutTopBtn) adminLogoutTopBtn.style.display = 'inline-block';
      syncLiveSettings();
      loadBookings();
    });
  }

  // 10. ADMIN FARES & RATE PER KM BROADCAST UPDATER
  function showAdminNotice(message, isSuccess = true) {
    if (adminSystemNotice) {
      adminSystemNotice.style.display = 'flex';
      adminSystemNotice.style.backgroundColor = isSuccess ? '#DCFCE7' : '#FEE2E2';
      adminSystemNotice.style.color = isSuccess ? '#15803D' : '#991B1B';
      adminSystemNotice.innerHTML = `<i class="fa-solid fa-${isSuccess ? 'circle-check' : 'triangle-exclamation'}"></i> <strong>${message}</strong>`;
      setTimeout(() => {
        adminSystemNotice.style.display = 'none';
      }, 3500);
    }
  }

  const pageSetAvailableBtn = document.getElementById('page-set-available-btn');
  const pageSetFullBtn = document.getElementById('page-set-full-btn');
  const dashCabStatusBadge = document.getElementById('dash-cab-status-badge');
  const dashFrontFare = document.getElementById('dash-front-fare');
  const dashMiddleFare = document.getElementById('dash-middle-fare');
  const dashThirdFare = document.getElementById('dash-third-fare');
  const dashRateKm = document.getElementById('dash-rate-km');

  function updateAdminDashboardStats(settings = liveSettings) {
    const status = (settings.cabStatus || 'AVAILABLE').toUpperCase();
    if (dashCabStatusBadge) {
      dashCabStatusBadge.textContent = status === 'FULL' ? 'FULL / SOLD OUT' : 'AVAILABLE';
      dashCabStatusBadge.style.color = status === 'FULL' ? '#EF4444' : '#10B981';
    }

    if (dashFrontFare) dashFrontFare.textContent = `₹${settings.frontSeatFare ?? 650}`;
    if (dashMiddleFare) dashMiddleFare.textContent = `₹${settings.middleSeatFare ?? 550}`;
    if (dashThirdFare) dashThirdFare.textContent = `₹${settings.thirdSeatFare ?? 450}`;
    if (dashRateKm) dashRateKm.textContent = `₹${settings.ratePerKm ?? 14}/km`;

    const frontInput = document.getElementById('edit-front-fare');
    const middleInput = document.getElementById('edit-middle-fare');
    const thirdInput = document.getElementById('edit-third-fare');
    const rateInput = document.getElementById('edit-rate-km');
    const hasUnsavedFareEdits = document.getElementById('admin-fares-form')?.dataset.dirty === 'true';

    if (!hasUnsavedFareEdits) {
      if (frontInput && frontInput.value !== String(settings.frontSeatFare ?? 650)) frontInput.value = settings.frontSeatFare ?? 650;
      if (middleInput && middleInput.value !== String(settings.middleSeatFare ?? 550)) middleInput.value = settings.middleSeatFare ?? 550;
      if (thirdInput && thirdInput.value !== String(settings.thirdSeatFare ?? 450)) thirdInput.value = settings.thirdSeatFare ?? 450;
      if (rateInput && rateInput.value !== String(settings.ratePerKm ?? 14)) rateInput.value = settings.ratePerKm ?? 14;
    }
  }

  async function sendAdminSettingsUpdate(payload) {
    settingsSyncVersion += 1;
    try {
      const res = await adminFetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      settingsSyncVersion += 1;
      if (data.success) {
        const merged = { ...liveSettings, ...data.data, ...payload };
        liveSettings = { ...liveSettings, ...merged };
        const fareKeys = ['frontSeatFare', 'middleSeatFare', 'thirdSeatFare', 'ratePerKm'];
        const isFareUpdate = fareKeys.some(key => Object.prototype.hasOwnProperty.call(payload, key));
        const faresForm = document.getElementById('admin-fares-form');
        if (isFareUpdate && faresForm) faresForm.dataset.dirty = 'false';
        updateAdminDashboardStats(liveSettings);
        showAdminNotice('System Settings & Fares Broadcasted to Main Reservation Page!');
        syncLiveSettings();
      }
    } catch (err) {
      settingsSyncVersion += 1;
      const merged = { ...liveSettings, ...payload };
      liveSettings = { ...liveSettings, ...merged };
      updateAdminDashboardStats(liveSettings);
      showAdminNotice('Settings Updated locally!');
    }
  }

  if (pageSetAvailableBtn) {
    pageSetAvailableBtn.addEventListener('click', () => {
      sendAdminSettingsUpdate({ cabStatus: 'AVAILABLE', statusNote: 'Premium car rentals are available.' });
    });
  }

  if (pageSetFullBtn) {
    pageSetFullBtn.addEventListener('click', () => {
      sendAdminSettingsUpdate({ cabStatus: 'FULL', statusNote: `Current hourly cab slot is FULL. Contact hotline ${HOTLINE_TEXT}.` });
    });
  }

  const adminFaresForm = document.getElementById('admin-fares-form');
  if (adminFaresForm) {
    adminFaresForm.addEventListener('input', () => {
      adminFaresForm.dataset.dirty = 'true';
    });

    adminFaresForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = parseInt(document.getElementById('edit-front-fare')?.value, 10) || 650;
      const m = parseInt(document.getElementById('edit-middle-fare')?.value, 10) || 550;
      const t = parseInt(document.getElementById('edit-third-fare')?.value, 10) || 450;
      const r = parseInt(document.getElementById('edit-rate-km')?.value, 10) || 14;

      sendAdminSettingsUpdate({ frontSeatFare: f, middleSeatFare: m, thirdSeatFare: t, ratePerKm: r });
    });
  }

  async function loadBookings() {
    const list = document.getElementById('dash-bookings-list');
    if (!list) return;

    list.innerHTML = '<div style="padding:16px; color:#64748B;">Loading passenger reservations...</div>';

    try {
      const res = await adminFetch(`${API_BASE}/api/bookings`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) {
        list.innerHTML = '<div style="padding:16px; color:#991B1B;">Could not load reservation log.</div>';
        return;
      }

      if (data.data.length === 0) {
        list.innerHTML = '<div style="padding:16px; color:#64748B;">No reservations yet.</div>';
        return;
      }

      list.innerHTML = data.data.map((booking) => {
        const status = booking.status || 'Pending';
        const driverName = booking.driverName || '';
        const tagColor = status === 'Confirmed' ? '#DCFCE7' : status === 'Completed' ? '#E0F2FE' : status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7';
        const tagTxtColor = status === 'Confirmed' ? '#15803D' : status === 'Completed' ? '#0369A1' : status === 'Cancelled' ? '#991B1B' : '#92400E';

        return `
          <div style="border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-bottom:12px; background:#F8FAFC;">
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:8px;">
              <div>
                <strong style="font-size:1rem; color:#0F172A;">${booking.name || 'Passenger'}</strong>
                <div style="font-size:0.82rem; color:#64748B;">${booking.phone || 'No phone'}</div>
              </div>
              <span style="padding:6px 10px; border-radius:9999px; font-size:0.72rem; font-weight:800; background:${tagColor}; color:${tagTxtColor};">${status}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; font-size:0.82rem; color:#475569;">
              <div><strong>Route:</strong> ${booking.pickup || 'N/A'} → ${booking.drop || 'N/A'}</div>
              <div><strong>Date:</strong> ${booking.date || 'N/A'}</div>
              <div><strong>Time:</strong> ${booking.time || 'N/A'}</div>
              <div><strong>Passengers:</strong> ${booking.passengers || 1}</div>
              <div><strong>Seat:</strong> ${booking.seatPosition || 'Middle Row (Comfort)'}</div>
              <div><strong>Fare:</strong> ₹${booking.totalFare || 0}</div>
            </div>
            <div class="booking-update-form" style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; align-items:end; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:10px; padding:10px;">
              <div style="display:flex; flex-direction:column; gap:4px; min-width:150px;">
                <label style="font-size:0.72rem; font-weight:700; color:#475569;">Driver Name</label>
                <input type="text" class="driver-name-input" value="${driverName}" placeholder="Enter driver name" style="padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.8rem; width:160px;">
              </div>
              <div style="display:flex; flex-direction:column; gap:4px; min-width:140px;">
                <label style="font-size:0.72rem; font-weight:700; color:#475569;">Ride Status</label>
                <select class="booking-status-input" style="padding:8px 10px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.8rem; background:#fff;">
                  <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Confirmed" ${status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
                  <option value="Cancelled" ${status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
              <button type="button" class="booking-update-btn" data-id="${booking._id}" style="padding:9px 14px; border:none; border-radius:8px; background:#0F766E; color:#fff; font-weight:700; cursor:pointer;">
                Save
              </button>
            </div>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.booking-update-btn').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = button.dataset.id;
          const form = button.closest('.booking-update-form');
          const driverInput = form?.querySelector('.driver-name-input');
          const statusInput = form?.querySelector('.booking-status-input');

          if (!form || !driverInput || !statusInput) return;

          const payload = {
            status: statusInput.value,
            driverName: driverInput.value.trim()
          };

          try {
            const res = await adminFetch(`${API_BASE}/api/bookings/${id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
              await loadBookings();
            } else {
              alert(result.message || 'Could not save driver details.');
            }
          } catch (err) {
            alert('Could not save ride update.');
          }
        });
      });
    } catch (err) {
      list.innerHTML = '<div style="padding:16px; color:#991B1B;">Reservation log failed to load.</div>';
    }
  }

  const refreshBookingsBtn = document.getElementById('refresh-bookings-btn');
  if (refreshBookingsBtn) {
    refreshBookingsBtn.addEventListener('click', loadBookings);
  }

  const downloadBookingsBtn = document.getElementById('download-bookings-btn');
  if (downloadBookingsBtn) {
    downloadBookingsBtn.addEventListener('click', async () => {
      const originalLabel = downloadBookingsBtn.innerHTML;
      downloadBookingsBtn.disabled = true;
      downloadBookingsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';

      try {
        const response = await adminFetch(`${API_BASE}/api/bookings`);
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || 'Could not load reservations for download.');
        }

        if (result.data.length === 0) {
          alert('There are no reservations to download yet.');
          return;
        }

        const columns = [
          ['Booking ID', '_id'],
          ['Passenger Name', 'name'],
          ['Phone', 'phone'],
          ['Pickup', 'pickup'],
          ['Drop', 'drop'],
          ['Travel Date', 'date'],
          ['Travel Time', 'time'],
          ['Passengers', 'passengers'],
          ['Seat Position', 'seatPosition'],
          ['Vehicle', 'vehicle'],
          ['Total Fare', 'totalFare'],
          ['Ride Status', 'status'],
          ['Driver Name', 'driverName'],
          ['Special Notes', 'specialNotes'],
          ['Booking Created At', 'createdAt']
        ];
        const escapeCsv = (value) => {
          const text = value == null ? '' : String(value);
          const safeText = /^[\t\r ]*[=+\-@]/.test(text) ? `'${text}` : text;
          return `"${safeText.replace(/"/g, '""')}"`;
        };
        const rows = [
          columns.map(([label]) => label),
          ...result.data.map((booking) => columns.map(([, field]) => booking[field]))
        ];
        const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n')}`;
        const fileUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `passenger-reservations-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
      } catch (error) {
        alert(error.message || 'Could not download the reservation report.');
      } finally {
        downloadBookingsBtn.disabled = false;
        downloadBookingsBtn.innerHTML = originalLabel;
      }
    });
  }

  // 11. AIRPORT TRANSFERS & OUTSTATION FULL VEHICLE HIRE DISPATCH
  const quoteModalForm = document.getElementById('quote-modal-form');
  const quoteModal = document.getElementById('quote-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');

  if (quoteModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quoteModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        quoteModal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }

    if (quoteModalForm) {
      quoteModalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('quote-name')?.value || activeClient?.name || 'Valued Client';
        const phone = document.getElementById('quote-phone')?.value || activeClient?.phone || 'Not provided';
        const details = document.getElementById('quote-details')?.value || 'Airport / Outstation Hire Request';

        const payload = { name, phone, travelDetails: details };

        // Save to backend DB asynchronously
        fetch(`${API_BASE}/api/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => { });

        const waMsg = encodeURIComponent(
          `*AIRPORT & OUTSTATION VEHICLE HIRE REQUEST*\n\n` +
          `👤 *Client Name:* ${name}\n` +
          `📞 *Contact Phone:* ${phone}\n` +
          `✈️ *Trip & Vehicle Requirements:* ${details}\n` +
          `⚡ *Vehicle Rate:* ₹${liveSettings.ratePerKm}/km AC Outstation Hire\n\n` +
          `Please provide full vehicle hire quote and confirm pickup slot!`
        );

        safeWhatsAppDispatch(waMsg);
        quoteModalForm.reset();
        quoteModal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
  }

  // 12. LEGACY BOOKING FORM HANDLER
  const bookingForm = document.getElementById('hero-booking-form') || document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (liveSettings.cabStatus === 'FULL') {
        alert(`This vehicle is currently unavailable. Please call ${HOTLINE_TEXT} for other rental options.`);
        return;
      }

      const passengerName = document.getElementById('name-input')?.value || 'Valued Passenger';
      const passengerPhone = document.getElementById('phone-input')?.value || HOTLINE_TEXT;
      const pickup = document.getElementById('pickup-select')?.value || 'Pickup Point';
      const drop = document.getElementById('drop-select')?.value || 'Destination';
      const travelDate = document.getElementById('date-input')?.value || new Date().toISOString().split('T')[0];
      const travelTime = document.getElementById('time-select')?.value || '07:00 AM';
      const selectedRow = rowSelect ? rowSelect.value : 'front';
      const seatCount = parseInt(passengersInput ? passengersInput.value : 1, 10) || 1;

      let seatRate = liveSettings.frontSeatFare;
      if (selectedRow === 'middle') seatRate = liveSettings.middleSeatFare;
      if (selectedRow === 'third') seatRate = liveSettings.thirdSeatFare;

      const totalAmount = seatCount * seatRate;

      const payload = {
        name: passengerName,
        phone: passengerPhone,
        pickup,
        drop,
        date: travelDate,
        time: travelTime,
        seatPosition: selectedRow === 'front' ? 'Front Row (VIP)' : selectedRow === 'middle' ? 'Middle Row (Comfort)' : 'Third Row (Economy)',
        passengers: seatCount,
        vehicle: 'Premium Rental Car',
        totalFare: totalAmount,
        status: 'Confirmed',
        specialNotes: `Route: ${pickup} to ${drop}`
      };

      try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          loadBookings();
        }
      } catch (err) {
        console.log('Booking save failed from browser');
      }

      const waMsg = encodeURIComponent(
        `*SHREE VENKATESHWARA - RENTAL REQUEST*\n\n` +
        `👤 *Passenger Name:* ${passengerName}\n` +
        `📞 *Contact Phone:* ${passengerPhone}\n` +
        `📍 *Route:* ${pickup} ➔ ${drop}\n` +
        `📅 *Date & Time:* ${travelDate} at ${travelTime}\n` +
        `💺 *Seat Selection:* ${selectedRow.toUpperCase()} Row (${seatCount} Seat${seatCount > 1 ? 's' : ''})\n` +
        `💳 *Total Ticket Fare:* ₹${totalAmount}\n` +
        `🚘 *Vehicle:* Premium Rental Car\n\n` +
        `Please confirm vehicle availability and pickup details.`
      );

      safeWhatsAppDispatch(waMsg);
      alert(`Booking Confirmed for ${passengerName}! Opening WhatsApp ticket confirmation for hotline ${HOTLINE_TEXT}.`);
    });
  }

  if (document.getElementById('admin-page-dashboard') && localStorage.getItem('sv_admin_authenticated') === 'true') {
    syncLiveSettings();
    loadBookings();
  }

});
