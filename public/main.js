// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

document.querySelectorAll(".service-card, .project-card").forEach((el) => {
  observer.observe(el);
});

// Custom cursor
const cursor = document.createElement("div");
const cursorDot = document.createElement("div");
cursor.className = "custom-cursor";
cursorDot.className = "cursor-dot";
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

// Update cursor position
document.addEventListener("mousemove", (e) => {
  requestAnimationFrame(() => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  });
});

// Cursor hover effects
document.querySelectorAll("a, button, .service-card").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursor.style.borderColor = "var(--accent-color)";
    cursorDot.style.opacity = "0";
  });

  element.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.borderColor = "var(--accent-color)";
    cursorDot.style.opacity = "1";
  });
});

// Hide cursor when leaving window
document.addEventListener("mouseleave", () => {
  cursor.style.display = "none";
  cursorDot.style.display = "none";
});

document.addEventListener("mouseenter", () => {
  cursor.style.display = "block";
  cursorDot.style.display = "block";
});

// Card hover effects
document
  .querySelectorAll(".service-card, .testimonial-card")
  .forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("card-hover");
      element.style.transform = "translateY(-8px)";
    });
    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("card-hover");
      element.style.transform = "translateY(0)";
    });
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      element.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(74, 144, 226, 0.1), transparent 50%)`;
    });
  });

// Handle contact form submission
const contactButton = document.querySelector('.cta-button[href^="mailto:"]');
if (contactButton) {
  contactButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Show thank you message
    const thankYouMessage = document.createElement("div");
    thankYouMessage.className = "thank-you-message";
    thankYouMessage.textContent = "Thank you! I'll get back to you soon.";

    const contact = document.querySelector(".contact");
    contact.appendChild(thankYouMessage);

    // Animate message
    setTimeout(() => {
      thankYouMessage.classList.add("show");
    }, 100);

    // Open email client after a short delay
    setTimeout(() => {
      window.location.href = this.href;
    }, 1000);
  });
}

// Testimonial card effects
document.querySelectorAll(".testimonial-card").forEach((card) => {
  // Mouse move effect
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update glow position
    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);

    // 3D rotation effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
    `;
  });

  // Reset on mouse leave
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
  });

  // Smooth entrance animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "all 0.6s ease";
  observer.observe(card);
});

// Initialize AOS
document.addEventListener("DOMContentLoaded", () => {
  // Service items animation
  const serviceItems = document.querySelectorAll(".service-item");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  serviceItems.forEach((item) => {
    observer.observe(item);

    // Add hover interaction
    item.addEventListener("mouseenter", () => {
      const features = item.querySelectorAll(".service-features span");
      features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.1}s`;
      });
    });

    item.addEventListener("mouseleave", () => {
      const features = item.querySelectorAll(".service-features span");
      features.forEach((feature) => {
        feature.style.transitionDelay = "0s";
      });
    });
  });
});
