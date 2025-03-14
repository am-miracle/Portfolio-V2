const carousels = document.querySelectorAll('.carousel');

carousels.forEach(carousel => {
    const carouselSlides = carousel.querySelector('.carousel-slides');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.parentElement.querySelector('.prev');
    const nextButton = carousel.parentElement.querySelector('.next');

    let currentIndex = 0;
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    carouselSlides.addEventListener('mousedown', dragStart);
    carouselSlides.addEventListener('mouseup', dragEnd);
    carouselSlides.addEventListener('mouseleave', dragEnd);
    carouselSlides.addEventListener('mousemove', drag);

    carouselSlides.addEventListener('touchstart', dragStart);
    carouselSlides.addEventListener('touchend', dragEnd);
    carouselSlides.addEventListener('touchmove', drag);

    prevButton.addEventListener('click', () => prevSlide(carousel));
    nextButton.addEventListener('click', () => nextSlide(carousel));

    function dragStart(event) {
        if (event.type === 'touchstart') {
            startPosition = event.touches[0].clientX;
        } else {
            startPosition = event.clientX;
        }
        isDragging = true;
        animationID = requestAnimationFrame(animation);
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
            currentTranslate = prevTranslate + currentPosition - startPosition;
        }
    }

    function dragEnd(event) {
        cancelAnimationFrame(animationID);
        const distance = currentTranslate - prevTranslate;
        if (distance > 100 && currentIndex < carouselItems.length - 1) {
            nextSlide(carousel);
        } else if (distance < -100 && currentIndex > 0) {
            prevSlide(carousel);
        } else {
            setTransform(prevTranslate);
        }
        isDragging = false;
    }

    function animation() {
        setTransform(currentTranslate);
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function setTransform(translate) {
        carouselSlides.style.transform = `translateX(${translate}px)`;
    }

    function prevSlide(carousel) {
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = 0;
        }
        currentTranslate = -currentIndex * carouselItems[0].offsetWidth;
        prevTranslate = currentTranslate;
        setTransform(currentTranslate);
    }

    function nextSlide(carousel) {
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        currentIndex++;
        if (currentIndex >= carouselItems.length) {
            currentIndex = carouselItems.length - 1;
        }
        currentTranslate = -currentIndex * carouselItems[0].offsetWidth;
        prevTranslate = currentTranslate;
        setTransform(currentTranslate);
    }
});

// Intersection Observer for pausing animations
const carouselWrappers = document.querySelectorAll(".carousel-wrapper");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const carousel = entry.target.querySelector(".carousel");
        const index = Array.from(carouselWrappers).indexOf(entry.target);

        if (entry.isIntersecting) {
            carousel.style.animationPlayState = "running";
            if (index > 0) {
                carouselWrappers[index - 1].querySelector(".carousel").style.animationPlayState = "paused";
            }
            if (index < carouselWrappers.length - 1) {
                carouselWrappers[index + 1].querySelector(".carousel").style.animationPlayState = "paused";
            }
        } else {
            carousel.style.animationPlayState = "paused";
        }
    });
});

carouselWrappers.forEach((carouselWrapper) => {
    observer.observe(carouselWrapper);
});