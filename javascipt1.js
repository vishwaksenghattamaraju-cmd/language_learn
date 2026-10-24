// Safe event listener helper to prevent null reference errors on multi-page setups
function addClick(id, handler) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("click", handler);
    }
}

// Background video: runs once per page and never restarts the video from script.
// - Respects "reduce motion" (pauses the footage; CSS shows the poster still instead).
// - If the browser blocks autoplay, the poster stays visible and playback is retried once on first touch/click.
(function initBackgroundVideo() {
    const video = document.querySelector(".bg-video__media");
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function tryPlay() {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {
                document.addEventListener("pointerdown", function () {
                    if (!motionQuery.matches) video.play().catch(function () {});
                }, { once: true, passive: true });
            });
        }
    }

    function syncWithMotionPreference() {
        if (motionQuery.matches) {
            video.pause();
        } else if (video.paused) {
            tryPlay();
        }
    }

    syncWithMotionPreference();
    if (motionQuery.addEventListener) {
        motionQuery.addEventListener("change", syncWithMotionPreference);
    } else if (motionQuery.addListener) {
        motionQuery.addListener(syncWithMotionPreference);
    }
})();

// Language external documentation links
addClick("python", function () {
    window.location.href = "https://www.python.org/downloads/";
});

addClick("node.js", function () {
    window.location.href = "https://nodejs.org/en/download";
});

addClick("C", function () {
    window.location.href = "https://installc.org/";
});

// Navigation buttons
addClick("home", function () {
    window.location.href = "home.html";
});

addClick("about", function () {
    window.location.href = "about.html";
});

// Back button on About page
addClick("back", function () {
    if (window.history.length > 1 && document.referrer) {
        window.history.back();
    } else {
        window.location.href = "home.html";
    }
});

// Contact Modal handlers
function showContactModal() {
    const modal = document.getElementById("contact-modal");
    if (modal) {
        modal.classList.remove("hidden");
    } else {
        alert("Contact Details:\nEmail: example@gmail.com\nPhone: 9988776655");
    }
}

function hideContactModal() {
    const modal = document.getElementById("contact-modal");
    if (modal) {
        modal.classList.add("hidden");
    }
}

// Contact navigation / modal trigger
addClick("contact", function () {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
        // If already on the page with contact-section (About page), scroll smoothly to it
        contactSection.scrollIntoView({ behavior: "smooth", block: "center" });
        contactSection.classList.remove("highlight-pulse");
        // Force reflow for animation restart
        void contactSection.offsetWidth;
        contactSection.classList.add("highlight-pulse");
        setTimeout(() => {
            contactSection.classList.remove("highlight-pulse");
        }, 1600);
    } else {
        // Otherwise (e.g. on Home page), open contact modal
        showContactModal();
    }
});

addClick("modal-close", hideContactModal);

// Close modal on outside backdrop click
const modalBackdrop = document.getElementById("contact-modal");
if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function (e) {
        if (e.target === modalBackdrop) {
            hideContactModal();
        }
    });
}

// Close modal on Escape key press
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        hideContactModal();
    }
});

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 300);
    }, 2200);
}

// Copy to clipboard actions for Contact details
addClick("copy-email", function () {
    const email = "example@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
            .then(() => showToast("Copied: " + email))
            .catch(() => fallbackCopy(email));
    } else {
        fallbackCopy(email);
    }
});

addClick("copy-phone", function () {
    const phone = "9988776655";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone)
            .then(() => showToast("Copied: " + phone))
            .catch(() => fallbackCopy(phone));
    } else {
        fallbackCopy(phone);
    }
});

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        showToast("Copied: " + text);
    } catch (err) {
        showToast("Press Ctrl+C to copy: " + text);
    }
    document.body.removeChild(textArea);
}
