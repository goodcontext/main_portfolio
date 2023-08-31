// mobile fullpage scroll
const $scrollMobileWrap = document.querySelector("#scroll-mobile-wrap");
const $scrollMobile = document.querySelectorAll(".scroll-mobile");
const $scrollMobileLi = document.querySelectorAll(".scroll-mobile-li");

const M_IDLE_PERIOD = 0;
const M_DURATION = 1000;
const M_DELAY = 200;
const M_IS_SCROLL_COMPLETED_DELAY = 600;

let mLastAnimation = 1000;
let mIndex = 0;
let mPreIndex = 0;
let mLastScrollTop = 0;
let mTimer;
let isScrollCompleted = true;

$scrollMobileLi.forEach((item, i) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();

    if (currentTime - mLastAnimation < M_IDLE_PERIOD + M_DURATION) {
      e.preventDefault();
      return;
    }
    mHandleClick(i);
    mLastAnimation = currentTime;

    return () => {
      item.removeEventListener("click");
    };
  });

  item.addEventListener("focusin", (e) => {
    e.currentTarget.classList.add("focused");

    return () => {
      item.removeEventListener("focusin");
    }
  });

  item.addEventListener("focusout", (e) => {
    e.currentTarget.classList.remove("focused");

    return () => {
      item.removeEventListener("focusout");
    }
  });
});

const mActiveClassControl = (i) => {
  mIndex = i;
  if (isScrollCompleted) {
    if (i !== mPreIndex) {
      $scrollMobileLi[mPreIndex].classList.remove("active");
      $scrollMobileLi[mPreIndex].classList.remove("focused");
    }

    $scrollMobileLi[i].classList.add("active");

    if (i !== mPreIndex) {
      mPreIndex = i;
    }
  }
}

const mHandleClick = (i) => {
  mIndex = i;

  if (i > $scrollMobile.length - 1) {
    return;
  } else {
    mActiveClassControl(i);
    isScrollCompleted = false;
    $scrollMobile[i].scrollIntoView({ behavior: "smooth" });
    setTimeout(function () { isScrollCompleted = true; }, M_IS_SCROLL_COMPLETED_DELAY);
  }
};

function isScrolledIntoView(el) {
  const rect = el.getBoundingClientRect();
  const isVisible = (rect.top <= window.innerHeight / 2) && (rect.bottom >= window.innerHeight / 2);

  return isVisible;
}

function mHandleScrollEvent(e) {
  mTimer = null;
  $scrollMobile.forEach((element, index) => {
    if (isScrolledIntoView(element)) {
      const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"

      if (st > mLastScrollTop) {
        mActiveClassControl(index);
      } else if (st < mLastScrollTop) {
        mActiveClassControl(index);
      } else {
        // else was horizontal scroll
      }

      mLastScrollTop = st <= 0 ? 0 : st;
    }
  })
}

window.addEventListener("scroll", function (e) {
  if (!mTimer) mTimer = setTimeout(mHandleScrollEvent, M_DELAY);

  return () => {
    window.removeEventListener("scroll");
  }
}, true);

// desktop fullpage scroll
const $scrollDesktopWrap = document.querySelector("#scroll-desktop-wrap");
const $scrollDesktop = document.querySelectorAll(".scroll-desktop");
const $scrollDesktopLi = document.querySelectorAll(".scroll-desktop-li");

const IDLE_PERIOD = 0;
const DURATION = 1000;

let lastAnimation = 1000;
let index = 0;
let preIndex = 0;
let isKeyDown = false;

$scrollDesktopLi.forEach((item, i) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();

    if (currentTime - lastAnimation < IDLE_PERIOD) {
      e.preventDefault();
      return;
    }
    handleClick(i);
    if (i !== preIndex) {
      preIndex = i;
    }
    lastAnimation = currentTime;

    return () => {
      item.removeEventListener("click");
    };
  });

  item.addEventListener("focusin", (e) => {
    e.currentTarget.classList.add("focused");

    return () => {
      item.removeEventListener("focusin");
    };
  });

  item.addEventListener("focusout", (e) => {
    e.currentTarget.classList.remove("focused");

    return () => {
      item.removeEventListener("focusout");
    };
  });
});

const activeClassControl = (index) => {
  $scrollDesktopLi[index].classList.add("active");
  $scrollDesktopLi[index].classList.add("focused");

  if (index !== preIndex) {
    $scrollDesktopLi[preIndex].classList.remove("active");
    $scrollDesktopLi[preIndex].classList.remove("focused");

    preIndex = index;
  }
}

const handleClick = (i) => {
  index = i;

  if (i > $scrollDesktop.length - 1) {
    return;
  } else {
    activeClassControl(i);
    $scrollDesktop[i].scrollIntoView({ behavior: "smooth" });
  }
};

const handleNext = (i) => {
  if (i > $scrollDesktop.length - 1) {
    return (index = $scrollDesktop.length - 1);
  } else {
    $scrollDesktop.forEach((item, index) => {
      if (i === index) {
        activeClassControl(i);
        item.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
};

const handlePrev = (i) => {
  if (i < 0) {
    return (index = 0);
  } else {
    $scrollDesktop.forEach((item, index) => {
      if (i === index) {
        activeClassControl(i);
        item.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
};

const handleWheel = (e) => {
  const delta = e.wheelDelta;
  const currentTime = new Date().getTime();

  if (currentTime - lastAnimation < IDLE_PERIOD + DURATION) {
    e.preventDefault();
    return;
  }

  if (delta > 0) {
    index--;
    handlePrev(index);
  } else {
    index++;
    handleNext(index);
  }
  lastAnimation = currentTime;
};

window.addEventListener("keyup", (e) => {
  const currentTime = new Date().getTime();

  if (currentTime - lastAnimation < IDLE_PERIOD + DURATION) {
    e.preventDefault();
    return;
  }

  if (e.code === "ArrowDown") {
    index++;
    handleNext(index);
  }
  if (e.code === "ArrowUp") {
    index--;
    handlePrev(index);
  }
  lastAnimation = currentTime;

  return () => {
    window.removeEventListener("keyup");
  };
});

$scrollDesktopWrap.addEventListener("wheel", (e) => {
  e.preventDefault();
  handleWheel(e);

  return () => {
    $scrollDesktopWrap.removeEventListener("wheel");
  };
});

// portfolio mobile swiper
const portfolioMobileSwiper = new Swiper(".m-portfolio__contents-swiper", {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".m-portfolio__swiper-pagination",
    clickable: true,
  },
});

// portfolio desktop swiper
const portfolioDesktopSwiper = new Swiper(".portfolio__contents-swiper", {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".portfolio__contents-swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".portfolio__contents-swiper-button-next",
    prevEl: ".portfolio__contents-swiper-button-prev",
  },
});

// toy project mobile swiper
const toyProjectMobileSwiper = new Swiper(".m-toy-project__contents-swiper", {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: ".m-toy-project__swiper-pagination",
    clickable: true,
  },
});

// toy project desktop swiper
const $toyProjectContentsSwiper = document.querySelector(".toy-project__contents-swiper");

const toyProjectDesktopSwiper = new Swiper(".toy-project__contents-swiper", {
  watchSlidesProgress: true,
  centeredSlides: true,
  slidesPerView: 3,
  spaceBetween: 2.083333333333333 + '%',
  loop: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".toy-project__contents-swiper-pagination",
    clickable: false,
    type: "custom",
    renderCustom: function (toyProjectDesktopSwiper, current, total) {
      return ((current % (total / 2)) === 0 ? 4 : (current % (total / 2))) + ' / ' + (total / 2);
    }
  },
  navigation: {
    nextEl: ".toy-project__contents-swiper-button-next",
    prevEl: ".toy-project__contents-swiper-button-prev",
  },
});

// div [role="button"] global keydown event handling.
const $divRoleButton = document.querySelectorAll('div[role="button"]');

$divRoleButton.forEach(element => {
  element.addEventListener('keydown', function (e) {
    const keyD = e.key !== undefined ? e.key : e.keyCode;
    // e.key && e.keycode have mixed support - keycode is deprecated but support is greater than e.key
    // I tested within IE11, Firefox, Chrome, Edge (latest) & all had good support for e.key

    if ((keyD === 'Enter' || keyD === 13) || (['Spacebar', ' '].indexOf(keyD) >= 0 || keyD === 32)) {
      // In IE11 and lower, e.key will equal "Spacebar" instead of ' '

      // Default behavior is prevented to prevent the page to scroll when "space" is pressed
      e.preventDefault();
      this.click();
    }
  });
});

// mobile Send click event when a tag is focused
const $sectionMobileTitle = document.querySelectorAll(".section-mobile-title");

$sectionMobileTitle.forEach((element, index) => {
  element.querySelector("a").addEventListener("focus", (e) => {
    mHandleClick(index + 1);
  });
});

// Send click event when a tag is focused
const $sectionDesktopTitle = document.querySelectorAll(".section-desktop-title");

$sectionDesktopTitle.forEach((element, index) => {
  element.querySelector("a").addEventListener("focus", (e) => {
    handleClick(index + 1);
  });
});
