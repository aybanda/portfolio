// Form handling
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector(".submit-btn");
  const serviceOptions = document.querySelectorAll(".service-option");
  const header = document.querySelector(".contact-header");

  // Determine API URL based on environment
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000/api/quote"
      : `${window.location.origin}/api/quote`; // This will use the current domain

  // Add hover effects for service options
  serviceOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
      gsap.to(option, {
        y: -2,
        boxShadow: "0 4px 12px rgba(74, 144, 226, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    option.addEventListener("mouseleave", () => {
      gsap.to(option, {
        y: 0,
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      services: Array.from(
        form.querySelectorAll('input[name="services"]:checked')
      ).map((checkbox) => checkbox.value),
      message: document.getElementById("message").value,
    };

    // Validate services selection
    if (formData.services.length === 0) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent = "Please select at least one service";
      form.querySelector(".service-selection").appendChild(errorMessage);

      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
      return;
    }

    try {
      // Show loading state immediately
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Set up request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Send request to server
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quote request");
      }

      // Create success message
      const successMessage = document.createElement("div");
      successMessage.className = "minimal-success";
      successMessage.innerHTML = `
        <div class="success-checkmark">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h3>Thank you, ${formData.name.split(" ")[0]}</h3>
        <p>I'll get back to you soon</p>
      `;

      // Animate form out and success message in
      const formWrapper = form.closest(".contact-form-wrapper");

      gsap
        .timeline()
        .to([header, formWrapper], {
          scale: 0.95,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        })
        .call(() => {
          header.style.display = "none";
          formWrapper.style.display = "none";
          formWrapper.parentNode.appendChild(successMessage);
        })
        .from(successMessage, {
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        });

      // Reset form
      setTimeout(() => {
        form.reset();
        header.style.display = "";
        formWrapper.style.display = "";
        gsap.to([header, formWrapper], {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        successMessage.remove();
      }, 3000);
    } catch (error) {
      console.error("Error:", error);

      // Show error message
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `
        <p>
          <span class="error-icon">⚠️</span>
          <span>${error.message || "Something went wrong. Please try again."}</span>
        </p>
      `;

      form.parentNode.insertBefore(errorMessage, form);

      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
});
