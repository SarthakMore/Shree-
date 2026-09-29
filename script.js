/* ==========================================================================
   SHREE VENKATESHWARA EXPRESS - DYNAMIC MERN & MULTI-PAGE APPLICATION LOGIC
   Robust Production Version: Hardened Security, Unified Form Selectors,
   Synchronous WhatsApp Dispatch (No Popup Blocking), and 100% Reliable Sync.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE = 'http://localhost:5000';
  const HOTLINE_NUMBER = '918669410303';
  const HOTLINE_TEXT = '866 941 0303';

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

  // 2. FROM & TO DROPDOWN AUTO-POPULATE OPPOSITE CITY
  const pickupSelect = document.getElementById('pickup-select');
  const dropSelect = document.getElementById('drop-select');

  if (pickupSelect && dropSelect) {
    pickupSelect.addEventListener('change', () => {
      if (pickupSelect.value.startsWith('Kolhapur') && dropSelect.value.startsWith('Kolhapur')) {
        dropSelect.value = 'Pune (Swargate)';
      } else if (pickupSelect.value.startsWith('Pune') && dropSelect.value.startsWith('Pune')) {
        dropSelect.value = 'Kolhapur (CBS Stand)';
      }
    });

    dropSelect.addEventListener('change', () => {
      if (dropSelect.value.startsWith('Pune') && pickupSelect.value.startsWith('Pune')) {
        pickupSelect.value = 'Kolhapur (CBS Stand)';
      } else if (dropSelect.value.startsWith('Kolhapur') && pickupSelect.value.startsWith('Kolhapur')) {
        pickupSelect.value = 'Pune (Swargate)';
      }
    });
  }

  // 3. DATE PICKER - PREVENT PAST DATES
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    if (!dateInput.value) dateInput.value = today;
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
    statusNote: 'VinFast Limo Green EV is accepting reservations for upcoming hourly slots.'
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
        passengerLimitMsg.innerHTML = `<i class="fa-solid fa-chair" style="color:var(--text-muted);"></i> <strong>Third Row Selected:</strong> Economy Shared Seats for up to 3 Passengers (₹${liveSettings.thirdSeatFare} per seat)`;
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
            statusBanner.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong>SORRY, TODAY'S HOURLY CAB SLOTS ARE FULL!</strong> ${liveSettings.statusNote}`;
          }
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.innerHTML = `<i class="fa-solid fa-ban"></i> CAB SLOTS FULL - CALL ${HOTLINE_TEXT}`;
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
            submitBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Confirm Seat Reservation & Get WhatsApp Ticket';
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
  async function loadFleetCars() {
    try {
      const res = await fetch(`${API_BASE}/api/cars`);
      const data = await res.json();
      if (data.success && data.data) {
        renderFleetCars(data.data);
        renderAdminCarsList(data.data);
      }
    } catch (err) { }
  }

  function renderFleetCars(cars) {
    const container = document.getElementById('fleet-cars-container');
    if (!container) return;

    container.innerHTML = cars.map(car => `
      <div class="vehicle-card" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:16px; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s;">
        <div style="position:relative; height:200px; overflow:hidden;">
          <img src="${car.photo}" alt="${car.name}" style="width:100%; height:100%; object-fit:cover;">
          <span style="position:absolute; top:12px; right:12px; background:#10B981; color:#FFFFFF; padding:4px 12px; border-radius:9999px; font-weight:bold; font-size:0.75rem;">
            ₹${car.ratePerKm}/km Rate
          </span>
          <span style="position:absolute; top:12px; left:12px; background:rgba(15,23,42,0.85); color:#FFFFFF; padding:4px 10px; border-radius:6px; font-size:0.75rem; font-weight:600;">
            ${car.category}
          </span>
        </div>
        <div style="padding:20px;">
          <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:8px; color:#0F172A;">${car.name}</h3>
          <div style="display:flex; gap:16px; color:#64748B; font-size:0.88rem; margin-bottom:14px;">
            <span><i class="fa-solid fa-users" style="color:var(--primary);"></i> ${car.capacity} Seats</span>
            <span><i class="fa-solid fa-gauge-high" style="color:#10B981;"></i> ₹${car.ratePerKm}/km Rate</span>
            <span><i class="fa-solid fa-clock" style="color:#EAB308;"></i> ₹${car.hourlyRate}/hr</span>
          </div>
          <ul style="list-style:none; padding:0; margin:0 0 16px; font-size:0.82rem; color:#475569;">
            ${(car.features || []).map(f => `<li style="margin-bottom:4px;"><i class="fa-solid fa-check" style="color:#10B981; margin-right:6px;"></i>${f}</li>`).join('')}
          </ul>
          <button onclick="dispatchCarHireWhatsApp('${car.name}', ${car.ratePerKm})" class="btn btn-primary" style="width:100%; text-align:center; padding:10px; font-weight:700; cursor:pointer;">
            <i class="fa-brands fa-whatsapp"></i> Hire Car at ₹${car.ratePerKm}/km
          </button>
        </div>
      </div>
    `).join('');
  }

  window.dispatchCarHireWhatsApp = function (name, rateKm) {
    const msg = encodeURIComponent(
      `*VEHICLE RENTAL INQUIRY - SHREE VENKATESHWARA EXPRESS*\n\n` +
      `🚗 *Vehicle Model:* ${name}\n` +
      `💳 *Rate per KM:* ₹${rateKm}/km AC Outstation Hire\n\n` +
      `Please confirm car availability and pickup slot!`
    );
    safeWhatsAppDispatch(msg);
  };

  function renderAdminCarsList(cars) {
    const listEl = document.getElementById('admin-cars-list');
    if (!listEl) return;

    listEl.innerHTML = cars.map(car => `
      <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:12px; padding:14px; display:flex; gap:12px; align-items:center;">
        <img src="${car.photo}" alt="${car.name}" style="width:70px; height:50px; object-fit:cover; border-radius:8px;">
        <div style="flex:1;">
          <h5 style="margin:0; font-size:0.95rem; font-weight:700;">${car.name}</h5>
          <span style="font-size:0.75rem; color:#64748B;">${car.category} • ₹${car.ratePerKm}/km • ${car.capacity} Seats</span>
        </div>
        <button onclick="deleteCarRecord('${car._id}')" class="btn btn-accent" style="padding:6px 12px; font-size:0.75rem; background:#EF4444; border-color:#EF4444;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `).join('');
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
      const payload = {
        name: document.getElementById('car-input-name')?.value,
        category: document.getElementById('car-input-category')?.value,
        photo: document.getElementById('car-input-photo')?.value,
        ratePerKm: document.getElementById('car-input-ratekm')?.value,
        capacity: document.getElementById('car-input-capacity')?.value,
        hourlyRate: document.getElementById('car-input-hourly')?.value
      };

      try {
        const res = await adminFetch(`${API_BASE}/api/cars`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Car added to fleet successfully!');
          addCarForm.reset();
          loadFleetCars();
        }
      } catch (err) {
        alert('Car saved to memory fleet!');
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

  // 9. ADMIN SECURITY AUTHENTICATION HANDLERS (VIA SECURE BACKEND AUTH ROUTE)
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPassInput = document.getElementById('admin-pass-input');
  const adminLoginMsg = document.getElementById('admin-login-msg');

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPass = adminPassInput ? adminPassInput.value : '';

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'admin', password: enteredPass })
        });
        const data = await res.json();

        if (data.success) {
          if (adminLoginMsg) {
            adminLoginMsg.style.display = 'flex';
            adminLoginMsg.style.backgroundColor = '#DCFCE7';
            adminLoginMsg.style.color = '#15803D';
            adminLoginMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Admin Password Verified!</strong> Opening Control Center...';
          }
          localStorage.setItem('sv_admin_authenticated', 'true');
          localStorage.setItem('sv_admin_token', data.token);
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 600);
        } else {
          if (adminLoginMsg) {
            adminLoginMsg.style.display = 'flex';
            adminLoginMsg.style.backgroundColor = '#FEE2E2';
            adminLoginMsg.style.color = '#991B1B';
            adminLoginMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>${data.message || 'Invalid Admin Password!'}</strong>`;
          }
        }
      } catch (err) {
        if (adminLoginMsg) {
          adminLoginMsg.style.display = 'flex';
          adminLoginMsg.style.backgroundColor = '#FEE2E2';
          adminLoginMsg.style.color = '#991B1B';
          adminLoginMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Server connection failed. Please try again later.</strong>';
        }
      }
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

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'admin', password: enteredPass })
        });
        const data = await res.json();

        if (data.success) {
          localStorage.setItem('sv_admin_authenticated', 'true');
          localStorage.setItem('sv_admin_token', data.token);
          if (adminPageLoginBox) adminPageLoginBox.style.display = 'none';
          if (adminPageDashboard) adminPageDashboard.style.display = 'block';
          if (adminLogoutTopBtn) adminLogoutTopBtn.style.display = 'inline-block';
          syncLiveSettings();
          loadBookings();
        } else {
          if (adminPageLoginMsg) {
            adminPageLoginMsg.style.display = 'flex';
            adminPageLoginMsg.style.backgroundColor = '#FEE2E2';
            adminPageLoginMsg.style.color = '#991B1B';
            adminPageLoginMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>${data.message || 'Invalid Password!'}</strong>`;
          }
        }
      } catch (err) {
        if (adminPageLoginMsg) {
          adminPageLoginMsg.style.display = 'flex';
          adminPageLoginMsg.style.backgroundColor = '#FEE2E2';
          adminPageLoginMsg.style.color = '#991B1B';
          adminPageLoginMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Server connection failed. Please try again later.</strong>';
        }
      }
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
      sendAdminSettingsUpdate({ cabStatus: 'AVAILABLE', statusNote: 'VinFast Limo Green EV is accepting reservations.' });
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

  // 12. SHARED CAB RESERVATION SUBMIT HANDLER (MATCHES hero-booking-form & booking-form)
  const bookingForm = document.getElementById('hero-booking-form') || document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (liveSettings.cabStatus === 'FULL') {
        alert(`Sorry, today's cab slots are FULL. Please call hotline ${HOTLINE_TEXT}.`);
        return;
      }

      const passengerName = document.getElementById('name-input')?.value || 'Valued Passenger';
      const passengerPhone = document.getElementById('phone-input')?.value || HOTLINE_TEXT;
      const pickup = document.getElementById('pickup-select')?.value || 'Kolhapur (CBS Stand)';
      const drop = document.getElementById('drop-select')?.value || 'Pune (Swargate)';
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
        vehicle: 'VinFast Limo Green EV',
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
        `*SHREE VENKATESHWARA EXPRESS - CONFIRMED CAB TICKET*\n\n` +
        `👤 *Passenger Name:* ${passengerName}\n` +
        `📞 *Contact Phone:* ${passengerPhone}\n` +
        `📍 *Route:* ${pickup} ➔ ${drop}\n` +
        `📅 *Date & Time:* ${travelDate} at ${travelTime}\n` +
        `💺 *Seat Selection:* ${selectedRow.toUpperCase()} Row (${seatCount} Seat${seatCount > 1 ? 's' : ''})\n` +
        `💳 *Total Ticket Fare:* ₹${totalAmount}\n` +
        `🚗 *Vehicle Model:* VinFast Limo Green EV (100% Electric)\n\n` +
        `Please issue driver details and boarding gate info!`
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
