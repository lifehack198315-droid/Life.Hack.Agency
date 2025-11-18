// LIFE HACK AGENCY – FRONTEND LOGIC
document.addEventListener("DOMContentLoaded", () => {
    /* ============================
       1. Set Dynamic Year in Footer
       ============================ */
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ============================
       2. Smooth Scrolling for Links
       ============================ */
    const internalLinks = document.querySelectorAll("a[href^='#']");
    internalLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /* ==========================================
       3. Highlight Nav Link for Current Section
       ========================================== */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

    function setActiveNav() {
        let currentId = null;
        const scrollPosition = window.scrollY + 140; // offset for sticky header

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentId = `#${section.id}`;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === currentId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", setActiveNav);
    setActiveNav();

    /* ==============================
       4. Reveal-on-Scroll Animations
       ============================== */
    const revealElements = document.querySelectorAll(".section, .hero");

    // Initialize pre-reveal state
    revealElements.forEach(el => {
        el.classList.add("pre-reveal");
    });

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    entry.target.classList.remove("pre-reveal");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18
        }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       5. Pricing "Agency Price Check" Badge + Animation
       ========================================== */
    const pricingSection = document.getElementById("pricing");

    if (pricingSection) {
        // Create the badge
        const badge = document.createElement("div");
        badge.className = "pricing-compare";
        badge.innerHTML = `
            <strong>Agency Price Check:</strong>
            Big agencies: <span class="compare-highlight">$3,000–$5,000+</span>
            • Life Hack Agency: <span class="compare-highlight">from $600</span>
            • Typical savings: <span id="savings-amount" class="compare-highlight">$0</span>+
        `;

        // Insert badge near top of pricing section
        const firstCard = pricingSection.querySelector(".hero") || pricingSection.firstElementChild;
        pricingSection.insertBefore(badge, firstCard);

        // Inline styling so this works without touching CSS again
        Object.assign(badge.style, {
            margin: "0 auto 22px",
            maxWidth: "780px",
            padding: "12px 20px",
            borderRadius: "999px",
            background: "rgba(0, 0, 0, 0.42)",
            border: "1px solid rgba(255, 255, 255, 0.23)",
            fontSize: "0.9rem",
            color: "#f7f9ff",
            boxShadow: "0 14px 32px rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
            opacity: "0",
            transform: "translateY(10px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
        });

        badge.querySelectorAll(".compare-highlight").forEach(span => {
            span.style.color = "#ffc857";
            span.style.fontWeight = "700";
        });

        // Animate savings number once badge is in view
        const savingsTarget = 2000; // ~avg savings
        const savingsDuration = 1300; // ms

        function animateSavings() {
            const el = document.getElementById("savings-amount");
            if (!el) return;

            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / savingsDuration, 1);
                const value = Math.floor(progress * savingsTarget);
                el.textContent = "$" + value.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
        }

        // Observe pricing section to reveal badge + kick off animation
        const badgeObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        badge.style.opacity = "1";
                        badge.style.transform = "translateY(0)";
                        animateSavings();
                        badgeObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.3
            }
        );

        badgeObserver.observe(pricingSection);
    }

    /* ==================================
       6. Tiny Quality-of-Life Enhancements
       ================================== */

    // Make hero buttons "bounce" slightly on focus via keyboard
    const buttons = document.querySelectorAll(".btn, button, input[type='submit']");
    buttons.forEach(btn => {
        btn.addEventListener("focus", () => {
            btn.style.outline = "none";
            btn.style.boxShadow = "0 0 0 3px rgba(255, 200, 87, 0.6)";
        });
        btn.addEventListener("blur", () => {
            btn.style.boxShadow = "";
        });
    });

});
/* Reveal animation */
.pre-reveal {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}

.revealed {
    opacity: 1;
    transform: translateY(0);
}

/* Active nav link */
.nav-links a.active {
    color: #ffc857;
}
