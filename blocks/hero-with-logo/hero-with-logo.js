export default function decorate(block) {
  document.body.classList.add('dark-page');
 
  // One row, two cells: cell 0 = image, cell 1 = headline
  const firstRow = block.children[0];
  const cells = firstRow ? [...firstRow.children] : [];
 
  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';
 
  // --- Cell 0: image (left) ---
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-with-logo-image';
  const picture = cells[0]?.querySelector('picture');
  if (picture) imageWrapper.appendChild(picture);
  inner.appendChild(imageWrapper);
 
  // --- Cell 1: headline (right) ---
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'hero-with-logo-title';
 
  const rawText = cells[1]?.textContent.trim() ?? '';
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
 
  block.replaceChildren(inner);
}
