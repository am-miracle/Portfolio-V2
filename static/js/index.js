const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const nav = document.getElementById('nav');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close')
const navLinks = document.querySelectorAll('.nav-link');
const main = document.querySelector("main");
const theme = document.querySelector("#theme-button");
const topOfMain = main.getBoundingClientRect().top;
var root = document.querySelector(":root");



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

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu')
  })
}

// MENU HIDDEN
if (navClose) {
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

// ==== Display & accessibility panel ====
const dpPanel = document.getElementById('display-panel');
const dpSheet = dpPanel ? dpPanel.querySelector('.display-panel__sheet') : null;

const displayPreferences = window.displayPreferences;
const applyTheme = (choice) => displayPreferences.applyTheme(choice);

// --- state (defaults: dark theme, rose accent, 16px text) ---
const savedPreferences = displayPreferences.read();
let themeChoice = savedPreferences.theme;
let accentHue = savedPreferences.accentHue;
let textSize = savedPreferences.textSize;
displayPreferences.apply(savedPreferences);

// reflect saved choices onto the radios
const checkRadio = (name, value) => {
  const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (el) el.checked = true;
};
checkRadio('dp-theme', themeChoice);
checkRadio('dp-accent', accentHue);
checkRadio('dp-size', textSize);

document.querySelectorAll('input[name="dp-theme"]').forEach((input) => {
  input.addEventListener('change', () => {
    themeChoice = input.value;
    localStorage.setItem('themeChoice', themeChoice);
    applyTheme(themeChoice);
  });
});

document.querySelectorAll('input[name="dp-accent"]').forEach((input) => {
  input.addEventListener('change', () => {
    accentHue = input.value;
    localStorage.setItem('accentHue', accentHue);
    root.style.setProperty('--primary-color-hue', accentHue);
  });
});

document.querySelectorAll('input[name="dp-size"]').forEach((input) => {
  input.addEventListener('change', () => {
    textSize = input.value;
    localStorage.setItem('textSize', textSize);
    document.documentElement.style.fontSize = textSize + 'px';
  });
});

let dpLastFocused = null;
const dpFocusable = () =>
  dpSheet ? dpSheet.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])') : [];

const openPanel = () => {
  if (!dpPanel) return;
  dpLastFocused = document.activeElement;
  dpPanel.classList.add('show');
  dpPanel.setAttribute('aria-hidden', 'false');
  if (theme) theme.setAttribute('aria-expanded', 'true');
  const first = dpFocusable()[0];
  if (first) first.focus();
};

const closePanel = () => {
  if (!dpPanel) return;
  dpPanel.classList.remove('show');
  dpPanel.setAttribute('aria-hidden', 'true');
  if (theme) theme.setAttribute('aria-expanded', 'false');
  if (dpLastFocused && dpLastFocused.focus) dpLastFocused.focus();
};

if (theme) theme.addEventListener('click', openPanel);
if (dpPanel) {
  dpPanel.querySelectorAll('[data-dp-close]').forEach((el) =>
    el.addEventListener('click', closePanel)
  );
  document.addEventListener('keydown', (e) => {
    if (!dpPanel.classList.contains('show')) return;
    if (e.key === 'Escape') {
      closePanel();
      return;
    }
    if (e.key === 'Tab') {
      const f = Array.from(dpFocusable());
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
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


// Function to observe sections and add animations
function observeSections() {
  const sections = document.querySelectorAll('.animate-section');

  const options = {
    root: null, // Use the viewport as the root
    rootMargin: '50px', // Start animation slightly before elements come into view
    threshold: 0.1, // Trigger when just 10% of the section is visible for earlier animation
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay before adding the class to ensure smooth transition
        requestAnimationFrame(() => {
          entry.target.classList.add('in-view');
        });
        observer.unobserve(entry.target); // Stop observing after animation
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });

  //   projectCards.forEach(card => {
  //     observer.observe(card);
  // });
}

// Call the function when the page loads
window.addEventListener('load', observeSections);

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".timeline-item");

  function checkVisibility() {
    const triggerBottom = window.innerHeight * 0.8;
    items.forEach(item => {
      const boxTop = item.getBoundingClientRect().top;
      if (boxTop < triggerBottom) {
        item.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility();
});

// Add this script to your existing JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class to body after initial render
  document.body.classList.add('loaded');

  // Remove pointer after first interaction
  // const pointer = document.querySelector('.customization-pointer');
  // document.addEventListener('click', () => {
  //     pointer.remove();
  // }, { once: true });
});
