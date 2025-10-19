// Initialize all functionality when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    
    // Initialize all components
    initSkillBars();
    initScrollAnimations();
    initTypingAnimation();
    initSmoothScroll();
    initProjectSlider();

    // ANIMATED SKILL BARS
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.setProperty('--target-width', width);
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // SCROLL ANIMATIONS
    function initScrollAnimations() {
        

        // Scale animation for hero section
        const scaleSections = document.querySelectorAll('.scale-on-scroll');
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.3 });
        scaleSections.forEach(section => scaleObserver.observe(section));

        // Parallax effect for orbital rings
        window.addEventListener('scroll', updateParallax);
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // TYPING ANIMATION
    function initTypingAnimation() {
        const roles = [
            "Web Developer",
            "Frontend Developer", 
            "Backend Developer",
            "QA Tester"
        ];
        
        const webdevSpan = document.querySelector('.webdev');
        let roleIndex = 0;
        let charIndex = 0;
        let isTyping = true;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isTyping) {
                charIndex++;
                webdevSpan.innerHTML = `<span>${currentRole.slice(0, charIndex)}<span class="cursor">|</span></span>`;
                
                if (charIndex === currentRole.length) {
                    isTyping = false;
                    setTimeout(typeEffect, 1500);
                } else {
                    setTimeout(typeEffect, 100);
                }
            } else {
                charIndex--;
                webdevSpan.innerHTML = `<span>${currentRole.slice(0, charIndex)}<span class="cursor">|</span></span>`;
                
                if (charIndex === 0) {
                    isTyping = true;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeEffect, 500);
                } else {
                    setTimeout(typeEffect, 50);
                }
            }
        }
        
        typeEffect();
    }

    // SMOOTH SCROLL NAVIGATION
    function initSmoothScroll() {
        const sections = ['about', 'services', 'contact', 'project'];
        
        sections.forEach(section => {
            document.querySelectorAll(`a[href="#${section}"]`).forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    setTimeout(() => {
                        document.querySelector(`#${section}`).scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    }, 300);
                });
            });
        });
    }

    
});

// PROJECT IMAGE SLIDER
function initProjectSlider() {
    const wrappers = document.querySelectorAll('.slider-wrapper');

    if (!wrappers.length) {
        console.warn('No slider wrappers found.');
        return;
    }

    wrappers.forEach((wrapper, wrapperIndex) => {
        const sliderContainer = wrapper.querySelector('.slider-container');
        const prevBtn = wrapper.querySelector('.slider-btn.prev');
        const nextBtn = wrapper.querySelector('.slider-btn.next');
        const dotsContainer = wrapper.parentElement.querySelector('.slider-dots');

        // Validate required elements exist
        if (!sliderContainer || !prevBtn || !nextBtn || !dotsContainer) {
            console.warn('Slider elements missing for wrapper index', wrapperIndex);
            return;
        }

        const slides = sliderContainer.querySelectorAll('.slider-item');
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Create navigation dots
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        // Update slider position and UI
        function updateSlider() {
            sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;
        }

        // Navigate to specific slide
        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            updateSlider();
        }

        // Navigate to next slide
        function nextSlide() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateSlider();
            }
        }

        // Navigate to previous slide
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }

        // Button click handlers
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Touch/swipe navigation
        let touchStartX = 0;
        let touchEndX = 0;

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchStartX - touchEndX;
            
            if (swipeDistance > 50) nextSlide();
            if (swipeDistance < -50) prevSlide();
        });

        // Initialize slider
        updateSlider();
    });
}