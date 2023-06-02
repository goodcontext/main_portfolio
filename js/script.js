// mobile fullpage scroll
const $scrollMobileWrap = document.querySelector(`#scroll-mobile-wrap`);
const $scrollMobile = document.querySelectorAll(`.scroll-mobile`);
const $scrollMobileLi = document.querySelectorAll(`.scroll-mobile-li`);

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
  item.addEventListener(`click`, (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();

    if (currentTime - mLastAnimation < M_IDLE_PERIOD + M_DURATION) {
      e.preventDefault();
      return;
    }
    mHandleClick(i);
    mLastAnimation = currentTime;
    return () => {
      item.removeEventListener(`click`);
    };
  });
});

const mActiveClassControl = (i) => {
  mIndex = i;
  if (isScrollCompleted) {
    $scrollMobileLi[mPreIndex].classList.remove(`active`);
    $scrollMobileLi[i].classList.add(`active`);  
    console.log(i, mPreIndex);
    mPreIndex = i;
  }
}

const mHandleClick = (i) => {
  mIndex = i;

  if (i > $scrollMobile.length - 1) {
    return;
  } else {
    mActiveClassControl(i);
    isScrollCompleted = false;
    $scrollMobile[i].scrollIntoView({ behavior: `smooth` });
    setTimeout(function() { isScrollCompleted = true; }, M_IS_SCROLL_COMPLETED_DELAY);
  }
};

const mHandleNext = (i) => {
  if (i > $scrollMobile.length - 1) {
    return (mIndex = $scrollMobile.length - 1);
  } else {
    $scrollMobile.forEach((item, mIndex) => {
      if (i === mIndex) {
        mActiveClassControl(i);
        item.scrollIntoView({ behavior: `smooth` });
      }
    });
  }
};

const mHandlePrev = (i) => {
  if (i < 0) {
    return (mIndex = 0);
  } else {
    $scrollMobile.forEach((item, mIndex) => {
      if (i === mIndex) {
        mActiveClassControl(i);
        item.scrollIntoView({ behavior: `smooth` });
      }
    });
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
      console.log(isScrolledIntoView(element), index);
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

window.addEventListener(`scroll`, function(e) {
  if (!mTimer) mTimer = setTimeout(mHandleScrollEvent, M_DELAY);
  return () => {
    window.removeEventListener(`scroll`);
  }
}, true);

// desktop fullpage scroll
const $scrollDesktopWrap = document.querySelector(`#scroll-desktop-wrap`);
const $scrollDesktop = document.querySelectorAll(`.scroll-desktop`);
const $scrollDesktopLi = document.querySelectorAll(`.scroll-desktop-li`);

const idlePeriod = 0;
const duration = 1000;

let lastAnimation = 1000;
let index = 0;
let preIndex = 0;

$scrollDesktopLi.forEach((item, i) => {
  item.addEventListener(`click`, (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();

    if (currentTime - lastAnimation < idlePeriod + duration) {
      e.preventDefault();
      return;
    }
    handleClick(i);
    preIndex = i;
    lastAnimation = currentTime;
    return () => {
      item.removeEventListener(`click`);
    };
  });
});

const activeClassControl = (index) => {
  $scrollDesktopLi[index].classList.add(`active`);
  $scrollDesktopLi[preIndex].classList.remove(`active`);
  console.log(index, preIndex);
  preIndex = index;
}

const handleClick = (i) => {
  index = i;

  if (i > $scrollDesktop.length - 1) {
    return;
  } else {
    activeClassControl(i);
    $scrollDesktop[i].scrollIntoView({ behavior: `smooth` });    
  }
};

const handleNext = (i) => {
  if (i > $scrollDesktop.length - 1) {
    return (index = $scrollDesktop.length - 1);
  } else {
    $scrollDesktop.forEach((item, index) => {
      if (i === index) {
        activeClassControl(i);
        item.scrollIntoView({ behavior: `smooth` });        
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
        item.scrollIntoView({ behavior: `smooth` });        
      }
    });
  }
};

const handleWheel = (e) => {
  const delta = e.wheelDelta;
  const currentTime = new Date().getTime();

  if (currentTime - lastAnimation < idlePeriod + duration) {
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

window.addEventListener(`keyup`, (e) => {
  const currentTime = new Date().getTime();

  if (currentTime - lastAnimation < idlePeriod + duration) {
    e.preventDefault();
    return;
  }

  if (e.code === `ArrowDown`) {
    index++;
    handleNext(index);
  }
  if (e.code === `ArrowUp`) {
    index--;
    handlePrev(index);
  }
  lastAnimation = currentTime;
  return () => {
    window.removeEventListener(`keyup`);
  };
});

$scrollDesktopWrap.addEventListener(`wheel`, (e) => {
  e.preventDefault();
  handleWheel(e);
  return () => {
    $scrollDesktopWrap.removeEventListener(`wheel`);
  };
});

// mobile swiper
const mobileSwiper = new Swiper(`.portfolio__contents-swiper`, {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: `.portfolio__contents-swiper-pagination`,
    clickable: true,
  },
  navigation: {
    nextEl: `.portfolio__contents-swiper-button-next`,
    prevEl: `.portfolio__contents-swiper-button-prev`,
  },
});

// desktop swiper
const desktopSwiper = new Swiper(`.m-portfolio__contents-swiper`, {
  slidesPerView: 1,
  loop: true,
  pagination: {
    el: `.m-portfolio__swiper-pagination`,
    clickable: true,
  },
});