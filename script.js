document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle Handling
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('open');
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (navList && navList.classList.contains('open')) {
                navList.classList.remove('open');
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Gallery Category Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Reset display mode depending on item type
                    if (card.classList.contains('featured-project-card')) {
                        card.style.display = 'grid';
                    } else {
                        card.style.display = 'block';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Intersection Observer for Animate-On-Scroll Features
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger animation only once
            }
        });
    }, {
        threshold: 0.1 // Triggers when 10% of the element enters viewport
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // Contact Form Action
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // पेज रीलोड होने से रोकता है
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const projectType = document.getElementById('project-type').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showFeedback('All fields are required.', 'error');
                return;
            }

            showFeedback('Sending your message...', 'info');

            // Formspree API पर डेटा भेजने के लिए Fetch का उपयोग
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showFeedback('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            showFeedback(data['errors'].map(error => error['message']).join(", "), 'error');
                        } else {
                            showFeedback('Oops! There was a problem submitting your form.', 'error');
                        }
                    })
                }
            })
            .catch(error => {
                showFeedback('Oops! There was a connectivity problem.', 'error');
            });
        });
    }

    function showFeedback(message, type) {
        if (formFeedback) {
            formFeedback.textContent = message;
            formFeedback.className = 'form-feedback'; 
            
            if (type === 'success') {
                formFeedback.classList.add('success');
            } else if (type === 'error') {
                formFeedback.classList.add('error');
            } else if (type === 'info') {
                formFeedback.style.color = 'var(--text-muted)';
            }
        }
    }
});