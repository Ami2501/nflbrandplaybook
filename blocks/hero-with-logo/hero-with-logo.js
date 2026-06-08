export default function decorate(block) {
  // ── 1. Read cells from the block table ──────────────────────────────────
  const rows = [...block.children];
  const logoCell = rows[0]?.children[0];
  const titleCell = rows[0]?.children[1] ?? rows[1]?.children[0];

  // ── 2. Build wrapper structure ──────────────────────────────────────────
  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';

  // ── 3. Logo ─────────────────────────────────────────────────────────────
  if (logoCell) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'hero-with-logo-logo';
    logoWrap.append(...logoCell.childNodes);
    inner.append(logoWrap);
  }

  // ── 4. Title — split each word onto its own line ─────────────────────────
  if (titleCell) {
    const titleWrap = document.createElement('div');
    titleWrap.className = 'hero-with-logo-title';

    // Find the heading (h1–h3) or fall back to first element
    const heading = titleCell.querySelector('h1, h2, h3')
      ?? titleCell.firstElementChild;

    if (heading) {
      const words = heading.textContent.trim().split(/\s+/);
      heading.innerHTML = words
        .map((w) => `<span class="hero-with-logo-word">${w}</span>`)
        .join('');
      titleWrap.append(heading);
    }

    // Carry over any remaining content (e.g. a subtitle paragraph)
    [...titleCell.children].forEach((el) => titleWrap.append(el));

    inner.append(titleWrap);
  }

  // ── 5. Replace block contents ────────────────────────────────────────────
  block.textContent = '';
  block.append(inner);
}
