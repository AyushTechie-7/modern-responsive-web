document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.section');
    const colorfulBackground = document.querySelector('.colorful-background');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const colors = ['#5b4ce6', '#ff4e50', '#9b8afe', '#42e695', '#ff6b9d', '#f9d423', '#00c6ff'];
    let currentColorIndex = 0;
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize Particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 4, direction: 'none', random: true, straight: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });

    // Function to interpolate between two colors
    function interpolateColor(color1, color2, factor) {
        const result = color1.slice(1).match(/.{2}/g).map((c, i) => {
            const c1 = parseInt(c, 16);
            const c2 = parseInt(color2.slice(1).match(/.{2}/g)[i], 16);
            return Math.round(c1 + (c2 - c1) * factor).toString(16).padStart(2, '0');
        });
        return `#${result.join('')}`;
    }

    // Function to update background color based on scroll
    function updateBackgroundColor() {
        const scrollY = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollY / docHeight;
        const colorIndex = scrollPercentage * (colors.length - 1);
        const indexFloor = Math.floor(colorIndex);
        const indexCeil = Math.min(indexFloor + 1, colors.length - 1);
        const factor = colorIndex - indexFloor;

        const color1 = colors[indexFloor];
        const color2 = colors[indexCeil];
        const interpolatedColor = interpolateColor(color1, color2, factor);

        const nextIndex = (indexFloor + 1) % colors.length;
        const nextColor = interpolateColor(colors[nextIndex], colors[(nextIndex + 1) % colors.length], factor);

        colorfulBackground.style.background = `linear-gradient(45deg, ${interpolatedColor}, ${nextColor}, ${colors[(indexFloor + 2) % colors.length]})`;
        colorfulBackground.style.opacity = 0.15 + (scrollPercentage * 0.35);

        ticking = false;
    }

    // Navbar scroll effects
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY > 50) {
                    nav.classList.add('scrolled');
                    nav.style.backgroundColor = `rgba(${parseInt(colors[currentColorIndex].slice(1, 3), 16)}, ${parseInt(colors[currentColorIndex].slice(3, 5), 16)}, ${parseInt(colors[currentColorIndex].slice(5, 7), 16)}, 0.2)`;
                } else {
                    nav.classList.remove('scrolled');
                    nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                }

                updateBackgroundColor();
                lastScrollY = scrollY;
            });
            ticking = true;
        }
    });

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });

        // Hover effect for nav links
        link.addEventListener('mouseenter', function() {
            this.style.color = colors[(currentColorIndex + 1) % colors.length];
            this.style.transform = 'scale(1.1)';
        });

        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = nav.classList.contains('scrolled') ? '#ffffff' : '#2c2f33';
            }
            this.style.transform = 'scale(1)';
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Highlight active section and change nav color
    window.addEventListener('scroll', function() {
        let fromTop = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        currentColorIndex = (currentColorIndex + 1) % colors.length;
                        if (nav.classList.contains('scrolled')) {
                            nav.style.backgroundColor = `rgba(${parseInt(colors[currentColorIndex].slice(1, 3), 16)}, ${parseInt(colors[currentColorIndex].slice(3, 5), 16)}, ${parseInt(colors[currentColorIndex].slice(5, 7), 16)}, 0.2)`;
                        }
                    }
                });
            }
        });
    });

    // Feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'rotate(360deg) scale(1.2)';
            this.style.backgroundColor = 'rgba(91, 76, 230, 0.05)';
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'rotate(0) scale(1)';
            this.style.backgroundColor = 'var(--card-bg)';
        });
    });

    // Contact form validation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name.length < 2) {
                formMessage.textContent = 'Please enter a valid name.';
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                formMessage.textContent = 'Please enter a valid email.';
                return;
            }

            if (message.length < 10) {
                formMessage.textContent = 'Message must be at least 10 characters.';
                return;
            }

            formMessage.style.color = '#42e695';
            formMessage.textContent = 'Message sent successfully!';
            contactForm.reset();
        });
    }

    // Initial scroll check
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
        nav.style.backgroundColor = `rgba(${parseInt(colors[currentColorIndex].slice(1, 3), 16)}, ${parseInt(colors[currentColorIndex].slice(3, 5), 16)}, ${parseInt(colors[currentColorIndex].slice(5, 7), 16)}, 0.2)`;
    }

    // Initial background update
    updateBackgroundColor();
});