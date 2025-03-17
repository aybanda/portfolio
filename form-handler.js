// Form handling
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  const submitBtn = form.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnIcon = submitBtn.querySelector(".btn-icon");
  const loadingSpinner = submitBtn.querySelector(".loading-spinner");
  const serviceOptions = document.querySelectorAll(".service-option");
  const header = document.querySelector(".contact-header");

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

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      services: formData.getAll("services"),
      message: formData.get("message"),
    };

    // Validate services selection
    if (data.services.length === 0) {
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
      // Show loading state with smooth transition
      submitBtn.classList.add("loading");
      gsap.to(form, {
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out",
      });
      form.style.pointerEvents = "none";

      // Send request to Netlify Forms
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Create minimal success message
      const successMessage = document.createElement("div");
      successMessage.className = "minimal-success";
      successMessage.innerHTML = `
        <div class="success-checkmark">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h3>Thank you, ${data.name.split(" ")[0]}</h3>
        <p>I'll get back to you soon</p>
      `;

      // Animate header and form out, success message in
      const formWrapper = form.closest(".contact-form-wrapper");

      gsap.timeline().to([header, formWrapper], {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          header.style.display = "none";
          formWrapper.style.display = "none";
          formWrapper.parentNode.appendChild(successMessage);

          gsap.from(successMessage, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          });
        },
      });
    } catch (error) {
      console.error("Submission error:", error);

      // Show minimal error message
      const errorContainer = document.createElement("div");
      errorContainer.className = "minimal-error";
      errorContainer.innerHTML = `
        <p>
          <span class="error-icon">⚠️</span>
          <span>Unable to connect to server. Please try again in a moment.</span>
        </p>
      `;

      form.parentNode.insertBefore(errorContainer, form);
      gsap.from(errorContainer, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      setTimeout(() => {
        gsap.to(errorContainer, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => errorContainer.remove(),
        });
      }, 3000);
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      form.style.pointerEvents = "auto";
      gsap.to(form, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });
});
