export default function decorate(block) {
  const paragraphs = [...block.querySelectorAll(':scope > p')];
  if (paragraphs.length === 0) return;

  const logoP = paragraphs[0];
  const titleP = paragraphs[1];

  // Create the hero root element
  const hero = document.createElement('div');
  hero.className = 'hero-with-logo-horizontal';

  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-horizontal-inner';

  // ---- Logo (left) --------------------------------------------------------
  if (logoP) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'hero-with-logo-horizontal-logo';

    while (logoP.firstChild) {
      logoWrap.appendChild(logoP.firstChild);
    }

    inner.appendChild(logoWrap);
  }

  // ---- Title (right) – single line, no word splitting --------------------
  if (titleP) {
    const titleWrap = document.createElement('div');
    titleWrap.className = 'hero-with-logo-horizontal-title';

    const heading = document.createElement('h1');
    heading.textContent = titleP.textContent.trim();

    titleWrap.appendChild(heading);
    inner.appendChild(titleWrap);
  }

  hero.appendChild(inner);

  block.textContent = '';
  block.appendChild(hero);
}

