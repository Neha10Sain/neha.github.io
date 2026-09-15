document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {

        navToggle.addEventListener('click', () => {

            const isOpen = navList.classList.toggle('open');

            navToggle.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

        });

    }


    /* =====================================================
       SMOOTH SCROLLING
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function (event) {

            const targetId = this.getAttribute('href');

            // Ignore empty "#" links
            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            // Close mobile navigation
            if (navList && navList.classList.contains('open')) {

                navList.classList.remove('open');

                if (navToggle) {
                    navToggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );
                }

            }

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        });

    });


    /* =====================================================
       PROJECT FILTER
    ===================================================== */

    const filterButtons =
        document.querySelectorAll('.filter-btn');

    const projectCards =
        document.querySelectorAll('.project-card');


    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            // Remove active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Activate clicked button
            button.classList.add('active');

            const filterValue =
                button.getAttribute('data-filter');


            projectCards.forEach(card => {

                const categories =
                    (card.getAttribute('data-category') || '')
                        .split(' ')
                        .filter(Boolean);


                const shouldShow =
                    filterValue === 'all' ||
                    categories.includes(filterValue);


                if (shouldShow) {

                    card.style.display = '';

                    // Small accessibility improvement
                    card.removeAttribute('aria-hidden');

                } else {

                    card.style.display = 'none';

                    card.setAttribute(
                        'aria-hidden',
                        'true'
                    );

                }

            });

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll('.scroll-reveal');


    if ('IntersectionObserver' in window) {

        const revealOnScroll =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add('active');

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.1
                }
            );


        revealElements.forEach(element => {

            revealOnScroll.observe(element);

        });

    } else {

        // Fallback for older browsers
        revealElements.forEach(element => {

            element.classList.add('active');

        });

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById(
            'portfolio-contact-form'
        );

    const formFeedback =
        document.getElementById(
            'form-feedback'
        );


    if (contactForm) {

        contactForm.addEventListener(
            'submit',
            async function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById('name')
                        .value
                        .trim();

                const email =
                    document
                        .getElementById('email')
                        .value
                        .trim();

                const message =
                    document
                        .getElementById('message')
                        .value
                        .trim();


                /* -----------------------------------------
                   CLIENT-SIDE VALIDATION
                ----------------------------------------- */

                if (!name || !email || !message) {

                    showFeedback(
                        'Please complete all required fields.',
                        'error'
                    );

                    return;
                }


                /* -----------------------------------------
                   EMAIL VALIDATION
                ----------------------------------------- */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showFeedback(
                        'Please enter a valid email address.',
                        'error'
                    );

                    return;
                }


                showFeedback(
                    'Sending your message...',
                    'info'
                );


                /* -----------------------------------------
                   DISABLE SUBMIT BUTTON
                   Prevents accidental double submissions
                ----------------------------------------- */

                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        'Sending...';

                }


                try {

                    const response =
                        await fetch(
                            contactForm.action,
                            {
                                method: 'POST',
                                body: new FormData(
                                    contactForm
                                ),
                                headers: {
                                    Accept:
                                        'application/json'
                                }
                            }
                        );


                    const data =
                        await response
                            .json()
                            .catch(() => ({}));


                    if (response.ok) {

                        showFeedback(
                            'Thank you! Your message has been sent successfully.',
                            'success'
                        );

                        contactForm.reset();

                    } else {

                        const errorMessage =
                            data?.errors
                                ?.map(error =>
                                    error.message
                                )
                                .join(', ');


                        showFeedback(
                            errorMessage ||
                            'Unable to submit the form. Please try again.',
                            'error'
                        );

                    }

                } catch (error) {

                    console.error(
                        'Contact form error:',
                        error
                    );


                    showFeedback(
                        'Unable to connect. Please try again later.',
                        'error'
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            'Send Message';

                    }

                }

            }
        );

    }


    /* =====================================================
       FORM FEEDBACK HELPER
    ===================================================== */

    function showFeedback(message, type) {

        if (!formFeedback) {
            return;
        }


        formFeedback.textContent = message;


        // Reset previous classes
        formFeedback.className =
            'form-feedback';


        if (type === 'success') {

            formFeedback.classList.add(
                'success'
            );

        } else if (type === 'error') {

            formFeedback.classList.add(
                'error'
            );

        } else {

            formFeedback.classList.add(
                'info'
            );

        }

    }

});