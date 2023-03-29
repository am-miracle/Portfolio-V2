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
    size.classList.add('active');

    if(size.classList.contains('font-size-1')){
      fontSize = '12px';
    }
    else if(size.classList.contains('font-size-2')){
      fontSize = '14px';
    }
    else if(size.classList.contains('font-size-3')){
      fontSize = '16px';
    }
    else if(size.classList.contains('font-size-4')){
      fontSize = '18px';
    }

    // change font size of the root html element
    document.querySelector('html').style.fontSize = fontSize;

    // Store active font size and active class to localStorage
    localStorage.setItem('activeFontSize', fontSize);
    localStorage.setItem('activeSizeSelector', size.id);

  })

  // Add ID attributes to font size selectors
  if (size.classList.contains('font-size-1')) {
    size.id = 'size-1';
  }
  else if (size.classList.contains('font-size-2')) {
    size.id = 'size-2';
  }
  else if (size.classList.contains('font-size-3')) {
    size.id = 'size-3';
  }
  else if (size.classList.contains('font-size-4')) {
    size.id = 'size-4';
  }
})

// Check if there is an active font size stored in localStorage
const activeFontSize = localStorage.getItem('activeFontSize');
const activeSizeSelector = localStorage.getItem('activeSizeSelector');

// If there is an active font size, set it as active
if (activeFontSize && activeSizeSelector) {
  fontSizes.forEach(size => {
    if (size.id === activeSizeSelector) {
      size.classList.add('active');
    }
  })
  document.querySelector('html').style.fontSize = activeFontSize;
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
      localStorage.setItem('color', primaryHue)
    }
    else if(color.classList.contains('color-2')){
      primaryHue = 52;
      localStorage.setItem('color', primaryHue)
    }
    else if(color.classList.contains('color-3')){
      primaryHue = 352
      localStorage.setItem('color', primaryHue)
    }
    else if(color.classList.contains('color-4')){
      primaryHue = 152
      localStorage.setItem('color', primaryHue)
    }
    else if(color.classList.contains('color-5')){
      primaryHue = 202
      localStorage.setItem('color', primaryHue)
    }

    localStorage.setItem('activeColor', color.classList);
    color.classList.add("active");

    root.style.setProperty("--primary-color-hue", localStorage.getItem('color'));
  })
})

if(localStorage.color) {
  root.style.setProperty("--primary-color-hue", localStorage.getItem('color'));
  const activeColorClass = localStorage.getItem('activeColor');
  const activeColorElement = document.querySelector(`.${activeColorClass}`);
  if (activeColorElement) {
    activeColorElement.classList.add('active');
  }
}

// Theme backgrounds
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// change background color
const changeBG = () => {
  root.style.setProperty('--light-color-lightness', lightColorLightness);
  localStorage.setItem('lightBg', lightColorLightness);
  root.style.setProperty('--white-color-lightness', whiteColorLightness);
  localStorage.setItem('whiteBg', whiteColorLightness);
  root.style.setProperty('--dark-color-lightness', darkColorLightness);
  localStorage.setItem('darkBg', darkColorLightness);
}

if(localStorage.lightBg && localStorage.whiteBg && localStorage.darkBg) {
  root.style.setProperty('--light-color-lightness', localStorage.getItem('lightBg'));
  root.style.setProperty('--white-color-lightness', localStorage.getItem('whiteBg'));
  root.style.setProperty('--dark-color-lightness', localStorage.getItem('darkBg'));
}

Bg1.addEventListener('click', () => {
  darkColorLightness = '17%';
  whiteColorLightness = '100%';
  lightColorLightness = '92%';

  // add active class and store in local storage
  Bg1.classList.add('active');
  localStorage.setItem('activeBg', 'Bg1');
  // remove active class from the others and remove from local storage
  Bg2.classList.remove('active');
  Bg3.classList.remove('active');
  changeBG();

});



Bg2.addEventListener('click', () => {
  darkColorLightness = '95%';
  whiteColorLightness = '20%';
  lightColorLightness = '15%';


  // add active class and store in local storage
  Bg2.classList.add('active');
  localStorage.setItem('activeBg', 'Bg2');
  // remove active class from the others and remove from local storage
  Bg1.classList.remove('active');
  Bg3.classList.remove('active');
  changeBG();
})


Bg3.addEventListener('click', () => {
  darkColorLightness = '95%';
  whiteColorLightness = '10%';
  lightColorLightness = '0%';

  // add active class and store in local storage
  Bg3.classList.add('active');
  localStorage.setItem('activeBg', 'Bg3');
  // remove active class from the others and remove from local storage
  Bg1.classList.remove('active');
  Bg2.classList.remove('active');
  changeBG();
});

// check if there is an active background in local storage and set the active class accordingly
if(localStorage.activeBg) {
  const activeBg = localStorage.getItem('activeBg');
  if(activeBg === 'Bg1') {
    Bg1.classList.add('active');
  } else if(activeBg === 'Bg2') {
    Bg2.classList.add('active');
  } else if(activeBg === 'Bg3') {
    Bg3.classList.add('active');
  }
}

const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget)
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    })
    tabs.forEach(tab => {
      tab.classList.remove('active')
    })
    tab.classList.add('active')
    target.classList.add('active')
  })
})