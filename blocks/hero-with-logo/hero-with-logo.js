export default function decorate(block) {
  // ── 1. Read cells ────────────────────────────────────────────────────────
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const logoCell  = cells[0];
  const titleCell = cells[1];

  // ── 2. Build inner wrapper ───────────────────────────────────────────────
  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';

  // ── 3. Logo (left) ───────────────────────────────────────────────────────
  if (logoCell) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'hero-with-logo-logo';
    logoWrap.append(...logoCell.childNodes);
    inner.append(logoWrap);
  }

  // ── 4. Title (right) — split each word onto its own line ─────────────────
  if (titleCell) {
    const titleWrap = document.createElement('div');
    titleWrap.className = 'hero-with-logo-title';

    const heading = titleCell.querySelector('h1, h2, h3')
      ?? titleCell.firstElementChild;

    if (heading) {
      const words = heading.textContent.trim().split(/\s+/);
      heading.innerHTML = words
        .map((w) => `<span class="hero-with-logo-word">${w}</span>`)
        .join('');
      titleWrap.append(heading);
    }

    // Preserve any subtitle / extra content
    [...titleCell.children].forEach((el) => titleWrap.append(el));

    inner.append(titleWrap);
  }

  // ── 5. Replace block contents ─────────────────────────────────────────────
  block.textContent = '';
  block.append(inner);
}
