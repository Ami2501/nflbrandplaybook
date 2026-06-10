function luminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((c) => parseInt(c, 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  const result = hex.replace('#', '').match(/.{2}/g).map((c) => parseInt(c, 16));
  return `rgb(${result.join(', ')})`;
}

export default function decorate(block) {
  const hideCodes = block.classList.contains('hide-codes');
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'color-swatch-v2-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    const name = cols[0]?.textContent.trim() || '';
    const hex = cols[1]?.textContent.trim() || '#000000';
    const desc = cols[2]?.textContent.trim() || '';
    const pantone = cols[3]?.textContent.trim() || '';

    const card = document.createElement('div');
    card.className = 'color-swatch-v2-card';

    // Left: large color block
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch-v2-swatch';
    swatch.style.backgroundColor = hex;

    const isLight = luminance(hex) > 0.4;
    swatch.classList.toggle('dark-text', isLight);

    // Right: info panel
    const info = document.createElement('div');
    info.className = 'color-swatch-v2-info';

    const nameEl = document.createElement('h3');
    nameEl.className = 'color-swatch-v2-name';
    nameEl.textContent = name;
    info.append(nameEl);

    if (desc) {
      const descEl = document.createElement('p');
      descEl.className = 'color-swatch-v2-desc';
      descEl.textContent = desc;
      info.append(descEl);
    }

    const codes = document.createElement('div');
    codes.className = 'color-swatch-v2-codes';

    if (!hideCodes) {
      const hexEl = document.createElement('div');
      hexEl.className = 'color-swatch-v2-code';
      hexEl.innerHTML = `<span class="code-label">HEX</span><span class="code-val">${hex.toUpperCase()}</span>`;
      codes.append(hexEl);

      const rgbEl = document.createElement('div');
      rgbEl.className = 'color-swatch-v2-code';
      rgbEl.innerHTML = `<span class="code-label">RGB</span><span class="code-val">${hexToRgb(hex)}</span>`;
      codes.append(rgbEl);
    }

    if (pantone) {
      const pantoneEl = document.createElement('div');
      pantoneEl.className = 'color-swatch-v2-code';
      pantoneEl.innerHTML = `<span class="code-label">PANTONE</span><span class="code-val">${pantone}</span>`;
      codes.append(pantoneEl);
    }

    info.append(codes);
    card.append(swatch);
    card.append(info);
    grid.append(card);
  });

  block.replaceChildren(grid);
}

