export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    if (!cols.length) {
      return;
    }

    const firstCol = cols[0];
    const picture = firstCol.querySelector('picture');

    const titleSource = firstCol.cloneNode(true);
    titleSource.querySelectorAll('picture').forEach((el) => el.remove());
    const title = titleSource.textContent.trim();

    let link = null;
    let linkColIndex = -1;

    cols.forEach((col, index) => {
      if (index === 0 || link) return;
      const foundLink = col.querySelector('a');
      if (foundLink) {
        link = foundLink;
        linkColIndex = index;
      }
    });

    const subtitleFragments = cols
      .filter((col, index) => index > 0 && index !== linkColIndex)
      .map((col) => {
        const clone = col.cloneNode(true);
        clone.querySelectorAll('a').forEach((anchor) => {
          const span = document.createElement('span');
          span.innerHTML = anchor.innerHTML;
          anchor.replaceWith(span);
        });
        clone.querySelectorAll('picture').forEach((el) => el.remove());
        return clone.innerHTML.trim();
      })
      .filter(Boolean);

    const subtitleHTML = subtitleFragments.join('');

    const card = document.createElement('a');
    card.className = 'asset-card';
    card.href = link?.href || '#';

    if (picture) {
      card.classList.add('has-image');
    }

    const ariaLabel = link?.textContent?.trim() || title;
    if (ariaLabel) {
      card.setAttribute('aria-label', ariaLabel);
    }

    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'asset-card-image';
      imgWrap.append(picture);
      card.append(imgWrap);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'asset-card-text';

    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      textWrap.append(h3);
    }

    if (subtitleHTML) {
      const subtitleWrap = document.createElement('div');
      subtitleWrap.className = 'asset-card-subtitle';
      subtitleWrap.innerHTML = subtitleHTML;
      textWrap.append(subtitleWrap);
    }

    card.append(textWrap);
    li.append(card);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
