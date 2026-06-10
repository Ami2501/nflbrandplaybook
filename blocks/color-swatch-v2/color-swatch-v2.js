function luminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((c) => parseInt(c, 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  const result = hex.replace('#', '').match(/.{2}/g).map((c) => parseInt(c, 16));
  return result.join(' / ');
}

function isValidHex(str) {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(str);
}

export default function decorate(block) {
  // da.live merges options into the block name class, so check with includes
  const hideCodes = block.closest('[class*="hide-codes"]') !== null;

  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'color-swatch-v2-grid';

  rows.forEach((row) => {
    const cols = [...row.children];

    // Skip rows where column 2 is not a valid hex value
    const potentialHex = cols[1]?.textContent.trim() || '';
    if (!isValidHex(potentialHex)) return;

    const name = cols[0]?.textContent.trim() || '';
    const hex = potentialHex;
    const desc = cols[2]?.textContent.trim() || '';
    const pantone = cols[3]?.textContent.trim() || '';

    const card = document.createElement('div');
    card.className = 'color-swatch-v2-card';

    // Color swatch block
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch-v2-color';
    swatch.style.backgroundColor = hex;

    const isLight = luminance(hex) > 0.4;
    swatch.classList.toggle('light-text', !isLight);
    swatch.classList.toggle('dark-text', isLight);

    const nameEl = document.createElement('span');
    nameEl.className = 'color-swatch-v2-name';
    nameEl.textContent = name;
    swatch.append(nameEl);

    card.append(swatch);

    // Info panel
    const info = document.createElement('div');
    info.className = 'color-swatch-v2-info';

    // Only render HEX and RGB if hide-codes is NOT set
    if (!hideCodes) {
      const hexEl = document.createElement('div');
      hexEl.className = 'color-swatch-v2-value';
      hexEl.innerHTML = `<span class="label">HEX</span><span class="val">${hex.toUpperCase()}</span>`;
      info.append(hexEl);

      const rgbEl = document.createElement('div');
      rgbEl.className = 'color-swatch-v2-value';
      rgbEl.innerHTML = `<span class="label">RGB</span><span class="val">${hexToRgb(hex)}</span>`;
      info.append(rgbEl);
    }

    if (pantone) {
      const pantoneEl = document.createElement('div');
      pantoneEl.className = 'color-swatch-v2-value';
      pantoneEl.innerHTML = `<span class="label">PANTONE</span><span class="val">${pantone}</span>`;
      info.append(pantoneEl);
    }

    if (desc) {
      const descEl = document.createElement('p');
      descEl.className = 'color-swatch-v2-desc';
      descEl.textContent = desc;
      info.append(descEl);
    }

    // Only append info if it has children
    if (info.children.length > 0) {
      card.append(info);
    }

    grid.append(card);
  });

  block.replaceChildren(grid);
}
