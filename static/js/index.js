const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const nav = document.getElementById('nav');
const navMenu =  document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close')
const navLinks = document.querySelectorAll('.nav-link');
const main = document.querySelector("main");
const theme = document.querySelector("#theme-button");
const themeModal = document.querySelector('.customize-theme');
let fontSizes = document.querySelectorAll('.choose-size span');
const colorPalette = document.querySelectorAll('.choose-color span');
const topOfMain = main.getBoundingClientRect().top;
var root = document.querySelector(":root");
const Bg1 = document.querySelector(".bg-1");
const Bg2 = document.querySelector(".bg-2");
const Bg3 = document.querySelector(".bg-3");



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

// SHOW MENU

if(navToggle){
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu')
  })
}

// MENU HIDDEN
if(navClose){
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu')
  })
}

const linkAction = () => {
  // when we click on each nav link, we remove the show menu class
  navMenu.classList.remove('show-menu')
}
navLinks.forEach(link => link.addEventListener('click', linkAction))


window.addEventListener("scroll", () => {
  if (mediaQuery && !mediaQuery.matches) {
    throttle(handleNavScroll, 250)
  }
});


// ==== Scroll sections active link =====

// get all sections that have an id defined
// const sections = document.querySelectorAll('section[id]');

// const navHighlighter = () => {
//   // get current scroll position
//   let scrollY = window.pageYOffset;
//   // now we loop through sections to get height , top and ID values for each
//   sections.forEach(current => {
//     const sectionHeight = current.offsetHeight;
//     const sectionTop = current.offsetTop - 40,
//     sectionId = current.getAttribute('id');

//     if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
//       document.querySelector(`.nav-menu a[href*= "${sectionId}" ]`).classList.add("active-link")
//     }
//     else{
//       document.querySelector(`.nav-menu a[href*= "${sectionId}" ]`).classList.remove("active-link")
//     }
//   })
// }
// // add an event listener listening for scroll
// window.addEventListener('scroll', navHighlighter);


// ==== Theme customization ===

// open modal
const openThemeModal = () => {
  themeModal.style.display = 'grid'
}
// close modal
const closeThemeModal = (e) => {
  if(e.target.classList.contains('customize-theme')) {
    themeModal.style.display = 'none'
  }
}
theme.addEventListener('click', openThemeModal);
themeModal.addEventListener('click', closeThemeModal);

// Choose Fonts

// remove active class from font size selectors
const removeSizeSelector = () => {
  fontSizes.forEach(size => {
    size.classList.remove("active");
  })
}

fontSizes.forEach(size => {
  size.addEventListener('click', () => {
    removeSizeSelector();

    let fontSize;

    size.classList.toggle('active');

    if(size.classList.contains('font-size-1')){
      fontSize = '12px'
    }
    else if(size.classList.contains('font-size-1')){
      fontSize = '14px'
    }
    else if(size.classList.contains('font-size-2')){
      fontSize = '14px'
    }
    else if(size.classList.contains('font-size-3')){
      fontSize = '16px'
    }
    else if(size.classList.contains('font-size-4')){
      fontSize = '18px'
    }
    // change font size of the root html element
    localStorage.setItem('font',document.querySelector('html').style.fontSize = fontSize);
  })
})

if(localStorage.font) {
  // fontSize = localStorage.font;
  document.querySelector('html').style.fontSize = localStorage.font;
}

// choose color
const changeActiveColorClass = () => {
  colorPalette.forEach(colorPicker => {
    colorPicker.classList.remove('active')
  })
}
colorPalette.forEach(color => {
  color.addEventListener('click', () => {
    changeActiveColorClass();

    let primaryHue;
    if(color.classList.contains('color-1')){
      primaryHue = 252;
    }
    else if(color.classList.contains('color-2')){
      primaryHue = 52;
    }
    else if(color.classList.contains('color-3')){
      primaryHue = 352
    }
    else if(color.classList.contains('color-4')){
      primaryHue = 152
    }
    else if(color.classList.contains('color-5')){
      primaryHue = 202
    }
    color.classList.add("active");
    localStorage.setItem('color', primaryHue)
    root.style.setProperty("--primary-color-hue", primaryHue)
  })
})

if(localStorage.color) {
  // fontSize = localStorage.font;
  primaryHue = localStorage.color;
}

// Theme backgrounds
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// change background color
const changeBG = () => {
  root.style.setProperty('--light-color-lightness', lightColorLightness);
  root.style.setProperty('--white-color-lightness', whiteColorLightness);
  root.style.setProperty('--dark-color-lightness', darkColorLightness);
}

Bg1.addEventListener('click', () => {
  darkColorLightness = '17%';
  whiteColorLightness = '100%';
  lightColorLightness = '92%';

  // add active class
  Bg1.classList.add('active');
  // remove active class from the others
  Bg2.classList.remove('active');
  Bg3.classList.remove('active');
  changeBG();
  // remove customized changes from local storage
  // window.location.reload();
});

Bg2.addEventListener('click', () => {
  darkColorLightness = '95%';
  whiteColorLightness = '20%';
  lightColorLightness = '15%';

  // add active class
  Bg2.classList.add('active');
  // remove active class from the others
  Bg1.classList.remove('active');
  Bg3.classList.remove('active');
  changeBG();
})


Bg3.addEventListener('click', () => {
  darkColorLightness = '95%';
  whiteColorLightness = '10%';
  lightColorLightness = '0%';

  // add active class
  Bg3.classList.add('active');
  // remove active class from the others
  Bg1.classList.remove('active');
  Bg2.classList.remove('active');
  changeBG();
});

const obj = {
  Bg1: Bg1,
  Bg2: Bg2,
  Bg3: Bg3,
}

console.log(obj)