export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    const firstCol = cols[0];
    const picture = firstCol?.querySelector('picture');
    const title = firstCol?.textContent.trim() || '';

    // Find the column that contains the card link
    const linkCol = cols.find((col, index) => index > 0 && col.querySelector('a'));
    const link = linkCol?.querySelector('a');

    // Any other column after the first is treated as subtitle
    const subtitleCol = cols.find((col, index) => index > 0 && col !== linkCol);

    const card = document.createElement('a');
    card.className = 'asset-card';

    if (picture) {
      card.classList.add('has-image');
    }

    card.href = link?.href || '#';

    const linkText = link?.textContent?.trim();
    if (linkText) {
      card.setAttribute('aria-label', linkText);
    } else if (title) {
      card.setAttribute('aria-label', title);
    }

    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'asset-card-image';
      imgWrap.append(picture);
      card.append(imgWrap);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'asset-card-text';

    const h3 = document.createElement('h3');
    h3.textContent = title;
    textWrap.append(h3);

    if (subtitleCol) {
      const subtitleWrap = document.createElement('div');
      subtitleWrap.className = 'asset-card-subtitle';

      const subtitleContent = subtitleCol.cloneNode(true);

      // Remove links from subtitle so the whole card remains the single clickable target
      subtitleContent.querySelectorAll('a').forEach((anchor) => {
        const span = document.createElement('span');
        span.innerHTML = anchor.innerHTML;
        anchor.replaceWith(span);
      });

      // Remove pictures if any were authored there by mistake
      subtitleContent.querySelectorAll('picture').forEach((el) => el.remove());

      if (subtitleContent.innerHTML.trim()) {
        subtitleWrap.innerHTML = subtitleContent.innerHTML;
        textWrap.append(subtitleWrap);
      }
    }

    card.append(textWrap);
    li.append(card);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
