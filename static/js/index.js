const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");


const nav = document.getElementById('nav');


let previousScrollPosition = 0;

const isScrollingDown = () => {
  let currentScrolledPosition = window.scrollY || window.pageYOffset;
  let scrollingDown;

  if (currentScrolledPosition > previousScrollPosition) {
    scrollingDown = true;
  } else {
    scrollingDown = false;
  }
  previousScrollPosition = currentScrolledPosition;
  return scrollingDown;
};

const handleNavScroll = () => {
  if (isScrollingDown() && !nav.contains(document.activeElement)) {
    nav.classList.add('scroll-down');
    nav.classList.remove('scroll-up');
  } else {
    nav.classList.add('scroll-up');
    nav.classList.remove('scroll-down')
  }
}

// initialize a throttleWait variable
let throttleWait;

const throttle = (callback, time) => {
  // if the variable is true, don't run the function
  if (throttleWait) return;

  // set the wait variable to true to pause the function
  throttleWait = true;

  // use setTimeout to run the function within the specified time
  setTimeout(() => {
    callback();

    // set throttleWait to false once the timer is up to restart the throttle function
    throttleWait = false;
  }, time);
}

window.addEventListener("scroll", () => {
  if (mediaQuery && !mediaQuery.matches) {
    throttle(handleNavScroll, 250)
  }
});