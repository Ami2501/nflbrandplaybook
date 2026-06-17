export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // First col = optional image + title; second col = link / subtitle
    const picture = cols[0]?.querySelector('picture');
    const title = cols[0]?.textContent.trim() || '';
    const link = cols[1]?.querySelector('a');

    // Subtitle can be any heading (h2–h6) or a <p> — preserve the element
    const subtitleEl = cols[1]?.querySelector('h2, h3, h4, h5, h6, p');

    const card = document.createElement('a');
    card.className = 'asset-card';
    if (picture) card.classList.add('has-image');

    card.href = link ? link.href : '#';

    // Image preview
    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'asset-card-image';
      imgWrap.append(picture);
      card.append(imgWrap);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'asset-card-text';

    // Title
    const h3 = document.createElement('h3');
    h3.textContent = title;
    textWrap.append(h3);

    // Subtitle — keep author's element type, just tag + move it
    if (subtitleEl) {
      subtitleEl.classList.add('asset-card-subtitle');
      textWrap.append(subtitleEl);
    } else if (link) {
      // No explicit subtitle element, but a link exists — use its text
      const p = document.createElement('p');
      p.className = 'asset-card-subtitle';
      p.textContent = link.textContent.trim();
      textWrap.append(p);
    } else {
      // Fall back to plain text in col 2
      const text = cols[1]?.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.className = 'asset-card-subtitle';
        p.textContent = text;
        textWrap.append(p);
      }
    }

    card.append(textWrap);
    li.append(card);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
