/* ============================================
   BMS — JavaScript Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initActiveNavLink();
    initCounterAnimation();
    initFormValidation();
});

/* ── Navbar Scroll Effect ── */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ── Mobile Menu ── */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    if (!toggle || !links) return;

    const close = () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.contains('open');
        if (isOpen) {
            close();
        } else {
            toggle.classList.add('active');
            links.classList.add('open');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    if (overlay) overlay.addEventListener('click', close);

    // Close on nav link click (mobile)
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', close);
    });

    // Close on escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
    });
}

/* ── Scroll Animations (Intersection Observer) ── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

/* ── Active Nav Link ── */
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ── Counter Animation ── */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('en-IN') + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('en-IN') + suffix;
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
}

/* ── Form Validation ── */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                clearError(field);

                if (!field.value.trim()) {
                    showError(field, 'This field is required');
                    isValid = false;
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    showError(field, 'Please enter a valid email address');
                    isValid = false;
                } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    showError(field, 'Please enter a valid phone number');
                    isValid = false;
                }
            });

            if (isValid) {
                showFormSuccess(form);
            }
        });

        // Live validation on blur
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => {
                clearError(field);
                if (!field.value.trim()) {
                    showError(field, 'This field is required');
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    showError(field, 'Please enter a valid email');
                }
            });

            field.addEventListener('input', () => {
                clearError(field);
            });
        });
    });
}

function showError(field, message) {
    field.style.borderColor = '#e53e3e';
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = 'color:#e53e3e;font-size:0.8rem;margin-top:4px;display:block;';
    field.parentNode.appendChild(error);
}

function clearError(field) {
    field.style.borderColor = '';
    const existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[+\d\s()-]{7,15}$/.test(phone);
}

function showFormSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '✓ सफलतापूर्वक भेजा गया!';
    btn.style.background = 'linear-gradient(135deg, #38a169, #2f855a)';
    btn.disabled = true;

    form.reset();

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
}

/* ── Smooth scroll for anchor links ── */
document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    }
});
