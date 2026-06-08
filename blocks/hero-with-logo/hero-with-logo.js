export default function decorate(block) {
  // Get all rows from the block
  const rows = [...block.children];

  // Create the hero inner wrapper
  const heroInner = document.createElement('div');
  heroInner.classList.add('hero-with-logo-inner');

  // Left side: title content
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('hero-with-logo-title');

  // Right side: logo content
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('hero-with-logo-logo');

  rows.forEach((row) => {
    const cols = [...row.children];

    if (cols[0]) {
      // First column → title
      titleWrapper.append(...cols[0].childNodes);
    }

    if (cols[1]) {
      // Second column → logo
      logoWrapper.append(...cols[1].childNodes);
    }
  });

  heroInner.append(titleWrapper, logoWrapper);

  // Clear the block and append structured markup
  block.textContent = '';
  block.append(heroInner);
}

