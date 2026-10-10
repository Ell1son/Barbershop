"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // Mobile navigation
  // =====================================

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open menu" : "Close menu",
      );

      mainNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  // =====================================
  // Booking date
  // =====================================

  const dateInput = document.querySelector("#date");

  // Use the local date to avoid timezone-related date shifts.
  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (dateInput) {
    const today = new Date();
    dateInput.min = getLocalDateString(today);

    dateInput.addEventListener("change", () => {
      renderTimeSlots();
    });
  }

  // =====================================
  // Time selection
  // =====================================

  const slotsContainer = document.querySelector("#slots");

  // These are example time slots, not actual available appointments.
  const availableTimes = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];

  function renderTimeSlots() {
    if (!slotsContainer) return;

    slotsContainer.replaceChildren();

    const selectedDate = dateInput ? dateInput.value : "";
    let timesToShow = [...availableTimes];

    // Hide past times when today's date is selected.
    if (selectedDate) {
      const now = new Date();
      const today = getLocalDateString(now);

      if (selectedDate < today) {
        timesToShow = [];
      } else if (selectedDate === today) {
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        timesToShow = timesToShow.filter((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const slotMinutes = hours * 60 + minutes;

          return slotMinutes > currentMinutes;
        });
      }
    }

    if (timesToShow.length === 0) {
      const message = document.createElement("p");
      message.className = "field-hint";
      message.textContent =
        "No times are available for this date in the demo schedule. Please choose another date.";

      slotsContainer.appendChild(message);
      return;
    }

    timesToShow.forEach((time, index) => {
      const label = document.createElement("label");
      label.className = "slot";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "time";
      input.value = time;
      input.required = true;

      if (index === 0) {
        input.checked = true;
      }

      const visual = document.createElement("span");
      visual.textContent = time;

      label.append(input, visual);
      slotsContainer.appendChild(label);
    });
  }

  renderTimeSlots();

  // =====================================
  // Booking form
  // =====================================

  const bookingForm = document.querySelector("#booking-form");
  const statusMessage = document.querySelector("#form-status");

  function showStatus(message, type = "success") {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", type === "error");
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingForm.reportValidity()) {
        showStatus(
          "Please check that all required fields are completed.",
          "error",
        );
        return;
      }

      const formData = new FormData(bookingForm);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service") || "");
      const master = String(formData.get("master") || "");
      const date = String(formData.get("date") || "");
      const time = String(formData.get("time") || "");

      if (!name || !phone || !service || !master || !date || !time) {
        showStatus("Please complete all fields and select a time.", "error");
        return;
      }

      if (date < getLocalDateString(new Date())) {
        showStatus("You cannot select a date in the past.", "error");
        return;
      }

      /*
        Demo mode:
        booking details are not sent anywhere.
        Connect a server, API, CRM, or form service
        to receive real booking requests.
      */

      const requestSummary = [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Barber: ${master}`,
        `Service: ${service}`,
        `Date: ${date}`,
        `Time: ${time}`,
      ].join("\n");

      console.info("BRUT demo booking request:\n" + requestSummary);

      showStatus(
        "This is a demo form: your request has not been sent. " +
          "Connect a form handler to receive real bookings.",
        "error",
      );
    });
  }

  // =====================================
  // Dynamic copyright year
  // =====================================

  const footerCopyright = document.querySelector(".footer-bottom span");

  if (footerCopyright) {
    footerCopyright.textContent = `© ${new Date().getFullYear()} BRUT BARBER CLUB`;
  }
});
