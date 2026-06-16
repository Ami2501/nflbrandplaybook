export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // Supported formats:
    // 1) Old: [image+title] [link]
    // 2) New: [image+title] [subtext] [link]
    const picture = cols[0]?.querySelector('picture');
    const title = cols[0]?.textContent.trim() || '';
    const subtext = cols.length >= 3 ? (cols[1]?.textContent.trim() || '') : '';
    const link = cols.length >= 3
      ? cols[2]?.querySelector('a')
      : cols[1]?.querySelector('a');

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

    // Image
    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'asset-card-image';
      imgWrap.append(picture);
      card.append(imgWrap);
    }

    // Text
    const textWrap = document.createElement('div');
    textWrap.className = 'asset-card-text';

    const h3 = document.createElement('h3');
    h3.textContent = title;
    textWrap.append(h3);

    if (subtext) {
      const p = document.createElement('p');
      p.textContent = subtext;
      textWrap.append(p);
    }

    card.append(textWrap);
    li.append(card);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
