const carousel = document.querySelector('.carousel');
const carouselSlides = carousel.querySelector('.carousel-slides');
const carouselItems = carousel.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

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

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

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
  const distance = currentPosition - startPosition;
  if (distance > 100 && currentIndex < carouselItems.length - 1) {
    nextSlide();
  } else if (distance < -100 && currentIndex > 0) {
    prevSlide();
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

function prevSlide() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = 0;
  }
  currentTranslate = -currentIndex * carouselItems[0].offsetWidth;
  prevTranslate = currentTranslate;
  setTransform(currentTranslate);
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= carouselItems.length) {
    currentIndex = carouselItems.length - 1;
  }
  currentTranslate = -currentIndex * carouselItems[0].offsetWidth;
  prevTranslate = currentTranslate;
  setTransform(currentTranslate);
}
