export default function decorate(block) {
  // Apply dark theme globally
  document.body.classList.add('dark-page');
 
  const rows = [...block.children];
 
  // Build inner wrapper
  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';
 
  // --- Row 0: image (left side) ---
  const imageRow = rows[0];
  if (imageRow) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-with-logo-image';
    const picture = imageRow.querySelector('picture');
    if (picture) {
      imageWrapper.appendChild(picture);
    }
    inner.appendChild(imageWrapper);
  }
 
  // --- Row 1: headline (right side) ---
  const titleRow = rows[1];
  if (titleRow) {
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'hero-with-logo-title';
 
    // Grab existing heading or fall back to raw text
    let heading = titleRow.querySelector('h1, h2, h3');
    if (!heading) {
      heading = document.createElement('h1');
      heading.textContent = titleRow.textContent.trim();
    }
 
    // Split headline text into one <span> per word
    const rawText = heading.textContent.trim();
    const words = rawText.split(/\s+/).filter(Boolean);
 
    const h1 = document.createElement('h1');
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'hero-with-logo-word';
      span.textContent = word;
      h1.appendChild(span);
    });
 
    titleWrapper.appendChild(h1);
    inner.appendChild(titleWrapper);
  }
 
  // Replace block contents with the new structure
  block.replaceChildren(inner);
}
