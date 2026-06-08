export default function decorate(block) {
  const rows = [...block.children];
 
  const heroInner = document.createElement('div');
  heroInner.classList.add('hero-with-logo-inner');
 
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('hero-with-logo-logo');
 
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('hero-with-logo-title');
 
  rows.forEach((row) => {
    const cols = [...row.children];
 
    if (cols[0]) {
      // First column → logo
      logoWrapper.append(...cols[0].childNodes);
    }
 
    if (cols[1]) {
      // Second column → title
      titleWrapper.append(...cols[1].childNodes);
    }
  });
 
  // Split each heading's text so every word renders on its own line
  titleWrapper.querySelectorAll('h1, h2, h3').forEach((heading) => {
    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map((word) => `<span class="hero-with-logo-word">${word}</span>`)
      .join('');
  });
 
  heroInner.append(logoWrapper, titleWrapper);
 
  block.textContent = '';
  block.append(heroInner);
}
