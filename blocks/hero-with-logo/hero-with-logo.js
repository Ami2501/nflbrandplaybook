// hero-with-logo.js
export default function decorate(block) {
  // Expecting default DA Live / Franklin table markup:
  // <div class="hero-with-logo block">
  //   <div>
  //     <div>logo cell</div>
  //     <div>headline cell</div>
  //   </div>
  // </div>

  // 1. Get the two main cells (logo + title)
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  const logoCell = cells[0];
  const titleCell = cells[1] || cells[0]; // fallback: single-cell layout

  // 2. Create inner wrapper
  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';

  // 3. Logo wrapper (left)
  if (logoCell) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'hero-with-logo-logo';
    // Move original logo content into wrapper
    while (logoCell.firstChild) {
      logoWrap.appendChild(logoCell.firstChild);
    }
    inner.appendChild(logoWrap);
  }

  // 4. Title wrapper (right) with word splitting
  if (titleCell) {
    const titleWrap = document.createElement('div');
    titleWrap.className = 'hero-with-logo-title';

    // Find a heading (h1–h3). If none, use first element as heading.
    let heading = titleCell.querySelector('h1, h2, h3');
    if (!heading) {
      heading = titleCell.firstElementChild;
    }

    if (heading) {
      // Split text content into words
      const text = heading.textContent.trim();
      const words = text.length ? text.split(/\s+/) : [];

      // Build spans: one word per line
      heading.innerHTML = words
        .map((word) => `<span class="hero-with-logo-word">${word}</span>`)
        .join('');

      titleWrap.appendChild(heading);
    }

    // Move any remaining siblings in title cell (e.g., subtitle <p>)
    // AFTER the heading
    const leftovers = [];
    while (titleCell.firstChild) {
      leftovers.push(titleCell.firstChild);
      titleCell.removeChild(titleCell.firstChild);
    }
    leftovers.forEach((node) => {
      // avoid re‑adding the heading we already moved
      if (node !== heading) {
        titleWrap.appendChild(node);
      }
    });

    inner.appendChild(titleWrap);
  }

  // 5. Replace original block content with our new structure
  block.textContent = '';
  block.appendChild(inner);
}
