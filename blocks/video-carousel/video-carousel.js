export default function decorate(block) {
  // Collect all video URLs from block rows
  const slides = [...block.children].map((row) => {
    const link = row.querySelector('a');
    const caption = row.querySelector('p:not(:has(a))');
    return {
      src: link?.href || '',
      caption: caption?.textContent?.trim() || '',
    };
  });

  block.textContent = '';

  if (!slides.length) return;

  // Build carousel wrapper
  const carousel = document.createElement('div');
  carousel.classList.add('video-carousel-track');

  // Build slides
  slides.forEach((slide, i) => {
    const item = document.createElement('div');
    item.classList.add('video-carousel-slide');
    if (i === 0) item.classList.add('active');

    const video = document.createElement('video');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.setAttribute('preload', 'none');
    video.classList.add('video-carousel-player');

    const source = document.createElement('source');
    source.setAttribute('src', slide.src);
    source.setAttribute('type', `video/${slide.src.split('.').pop().split('?')[0]}`);
    video.append(source);

    // Unmute button
    const controls = document.createElement('div');
    controls.classList.add('video-carousel-controls');

    const muteBtn = document.createElement('button');
    muteBtn.classList.add('video-carousel-mute-btn');
    muteBtn.setAttribute('aria-label', 'Unmute video');
    muteBtn.innerHTML = mutedIcon();

    muteBtn.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false;
        muteBtn.innerHTML = unmutedIcon();
        muteBtn.setAttribute('aria-label', 'Mute video');
      } else {
        video.muted = true;
        muteBtn.innerHTML = mutedIcon();
        muteBtn.setAttribute('aria-label', 'Unmute video');
      }
    });

    controls.append(muteBtn);

    // Caption
    if (slide.caption) {
      const cap = document.createElement('div');
      cap.classList.add('video-carousel-caption');
      cap.textContent = slide.caption;
      item.append(cap);
    }

    item.append(video);
    item.append(controls);
    carousel.append(item);
  });

  // Prev / Next buttons
  const prev = document.createElement('button');
  prev.classList.add('video-carousel-prev');
  prev.setAttribute('aria-label', 'Previous video');
  prev.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>`;

  const next = document.createElement('button');
  next.classList.add('video-carousel-next');
  next.setAttribute('aria-label', 'Next video');
  next.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>`;

  // Dots
  const dots = document.createElement('div');
  dots.classList.add('video-carousel-dots');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('video-carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.append(dot);
  });

  // State
  let current = 0;

  function getVideo(index) {
    return carousel.children[index]?.querySelector('video');
  }

  function getMuteBtn(index) {
    return carousel.children[index]?.querySelector('.video-carousel-mute-btn');
  }

  function playSlide(index) {
    const video = getVideo(index);
    if (!video) return;
    video.muted = true;
    const btn = getMuteBtn(index);
    if (btn) {
      btn.innerHTML = mutedIcon();
      btn.setAttribute('aria-label', 'Unmute video');
    }
    video.play().catch(() => {
      video.muted = true;
      video.play();
    });
  }

  function pauseSlide(index) {
    const video = getVideo(index);
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  function updateDots(index) {
    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function goTo(index) {
    pauseSlide(current);
    carousel.children[current]?.classList.remove('active');

    current = (index + slides.length) % slides.length;

    carousel.children[current]?.classList.add('active');
    updateDots(current);
    playSlide(current);
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  // Intersection Observer — play when in viewport, pause when out
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playSlide(current);
      } else {
        pauseSlide(current);
      }
    });
  }, { threshold: 0.5 });

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  block.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  block.append(prev);
  block.append(carousel);
  block.append(next);
  block.append(dots);

  observer.observe(block);
}

function mutedIcon() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="white">
    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 2 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>`;
}

function unmutedIcon() {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="white">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>`;
}

