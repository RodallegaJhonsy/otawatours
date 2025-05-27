document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a.nav-link"); // More specific selector
    const navbar = document.querySelector(".navbar");

    // --- Mobile Navigation ---
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu && navMenu.classList.contains("active")) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            }
            // The active state will be handled by updateActiveLink on scroll/load
        });
    });

    // --- Navbar Scroll Effect ---
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Animate on Scroll ---
    // This should be robust and run regardless of other script parts.
    try {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if (animatedElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Stop observing once animated
                    }
                });
            }, { threshold: 0.1 }); // Trigger when 10% of the element is visible
            animatedElements.forEach(el => observer.observe(el));
        }
    } catch (e) {
        console.error("Error setting up IntersectionObserver for scroll animations:", e);
        // Fallback: make all animated elements visible if observer fails
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('is-visible'); // Add class for consistency if other styles depend on it
        });
    }

    // --- Form Submissions (Conditional to prevent errors on pages without these forms) ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = bookingForm.querySelector('#name').value;
            const email = bookingForm.querySelector('#email').value;
            if (name.trim() === '' || email.trim() === '') {
                alert('Please fill in your name and email.');
                return;
            }
            const confirmationMsg = document.getElementById('booking-confirmation');
            if(confirmationMsg) confirmationMsg.style.display = 'block';
            bookingForm.reset();
            if(confirmationMsg) setTimeout(() => { confirmationMsg.style.display = 'none'; }, 5000);
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#contact-name').value;
            const email = contactForm.querySelector('#contact-email').value;
            const message = contactForm.querySelector('#contact-message').value;
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }
            const confirmationMsg = document.getElementById('contact-confirmation');
            if(confirmationMsg) confirmationMsg.style.display = 'block';
            contactForm.reset();
            if(confirmationMsg) setTimeout(() => { confirmationMsg.style.display = 'none'; }, 5000);
        });
    }

    // --- Scrollspy for Active Link in Navigation ---
    const sectionsForScrollspy = document.querySelectorAll("main > section[id]"); // Direct children sections of main with an ID

    function updateActiveLink() {
        let currentActiveSectionId = null;
        const scrollY = window.pageYOffset;
        const navOffset = navbar ? navbar.offsetHeight + 20 : 100; // Dynamic offset based on navbar height

        // Determine active section for scrollspy pages (like index.html)
        if (sectionsForScrollspy.length > 0) {
            sectionsForScrollspy.forEach(section => {
                // Check if section is not null and offsetTop is a number
                if (section && typeof section.offsetTop === 'number' && typeof section.offsetHeight === 'number') {
                    const sectionTop = section.offsetTop - navOffset;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (scrollY >= sectionTop && scrollY < sectionBottom) {
                        currentActiveSectionId = section.getAttribute('id');
                    }
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (!linkHref) return; // Skip if link has no href

            // Highlight link if it matches the current page (e.g., games.html)
            // Extract filename from linkHref (e.g. "games.html" from "games.html" or "./games.html")
            const linkPageName = linkHref.substring(linkHref.lastIndexOf('/') + 1);
            // Extract filename from current URL
            const currentPageName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || "index.html";


            if (linkPageName === currentPageName) {
                // If it's a link to the current page (like "games.html" on games.html page)
                // and no specific section is active via scrollspy, or it's the home link on index.html
                if (!currentActiveSectionId || (currentPageName === "index.html" && linkHref.includes('home'))) {
                     link.classList.add('active');
                }
            }
            
            // Highlight link if it matches a scrollspy section ID
            if (currentActiveSectionId && linkHref.includes(`#${currentActiveSectionId}`)) {
                navLinks.forEach(l => l.classList.remove('active')); // Ensure only one is active
                link.classList.add('active');
            }
        });

        // If on index.html and scrolled to the very top, ensure "Home" link is active
        const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
        if (isIndexPage && scrollY < ((sectionsForScrollspy[0]?.offsetTop || navOffset) - navOffset + 10) ) {
             navLinks.forEach(l => l.classList.remove('active'));
            const homeLink = document.querySelector(".nav-menu a[href*='home']");
            if (homeLink) homeLink.classList.add('active');
        }
    }
    
    if (navLinks.length > 0) {
        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink(); // Initial call to set active link on page load/refresh
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // TU CLAVE DE ACCESO DE WEB3FORMS AQUÍ. ¡YA LA TENEMOS!
    const WEB3FORMS_ACCESS_KEY = 'd98dcf1a-617a-4160-a31f-c266e025001b'; 

    // --- Para el formulario de Booking ---
    const bookingForm = document.getElementById('booking-form');
    const bookingConfirmation = document.getElementById('booking-confirmation');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(bookingForm);
            // Agrega tu clave de acceso de Web3Forms al FormData
            formData.append('access_key', WEB3FORMS_ACCESS_KEY);
            
            try {
                // CAMBIO A LA URL DE WEB3FORMS
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    bookingForm.reset();
                    bookingForm.style.display = 'none';
                    bookingConfirmation.style.display = 'block';
                } else {
                    const errorData = await response.json();
                    alert('Error al enviar la reserva: ' + (errorData.message || 'Inténtalo de nuevo.'));
                }
            } catch (error) {
                console.error('Error en la conexión:', error);
                alert('Hubo un problema de conexión. Por favor, intenta de nuevo más tarde.');
            }
        });
    }

    // --- Para el formulario de Contacto ---
    const contactForm = document.getElementById('contact-form');
    const contactConfirmation = document.getElementById('contact-confirmation');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(contactForm);
            // Agrega tu clave de acceso de Web3Forms al FormData
            formData.append('access_key', WEB3FORMS_ACCESS_KEY);
            
            try {
                // CAMBIO A LA URL DE WEB3FORMS
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (response.ok) {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    contactConfirmation.style.display = 'block';
                } else {
                    const errorData = await response.json();
                    alert('Error al enviar el mensaje: ' + (errorData.message || 'Inténtalo de nuevo.'));
                }
            } catch (error) {
                console.error('Error en la conexión:', error);
                alert('Hubo un problema de conexión. Por favor, intenta de nuevo más tarde.');
            }
        });
    }
});