// hero-with-logo.js
export default function decorate(block) {
  // Here "block" is the <div class="default-content-wrapper"> in your screenshot

  const paragraphs = [...block.querySelectorAll(':scope > p')];
  if (paragraphs.length === 0) return;

  const logoP = paragraphs[0];
  const titleP = paragraphs[1];

  // Create the hero root element
  const hero = document.createElement('div');
  hero.className = 'hero-with-logo';

  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';

  // ---- Logo (left) --------------------------------------------------------
  if (logoP) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'hero-with-logo-logo';

    // Move picture (or whatever is inside first <p>) into logo wrapper
    while (logoP.firstChild) {
      logoWrap.appendChild(logoP.firstChild);
    }

    inner.appendChild(logoWrap);
  }

  // ---- Title (right) – split into words ----------------------------------
  if (titleP) {
    const titleWrap = document.createElement('div');
    titleWrap.className = 'hero-with-logo-title';

    // Treat the text in the second <p> as the headline
    const heading = document.createElement('h1');
    const rawText = titleP.textContent.trim();
    const words = rawText.length ? rawText.split(/\s+/) : [];

    heading.innerHTML = words
      .map((w) => `<span class="hero-with-logo-word">${w}</span>`)
      .join('');

    titleWrap.appendChild(heading);
    inner.appendChild(titleWrap);
  }

  hero.appendChild(inner);

  // Replace the default-content-wrapper contents with the new hero
  block.textContent = '';
  block.appendChild(hero);
}
