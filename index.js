let mjcSqs = {};

const findOnPage = (stringToFind = '', elementsToSearch = '') => {
  let matches = [];
  document.querySelectorAll(elementsToSearch).forEach(node => {
    node.innerText.includes(stringToFind) ? matches.push(node) : '';
  })
  return matches.length > 0 ? matches : false;
}

// Recursively finds sectionId of node
const getSectionId = (node) => {
  if (node.hasAttribute('data-section-id')) {
    return node.getAttribute('data-section-id');
  }

  return getSectionId(node.parentNode)
}

const numberedHeadings = () => {
  if (!findOnPage('*1* ', 'h2')) return;
  let defaultHeading = document.querySelector('h2').style;
  let headingStyles = {
    fontSize: defaultHeading.fontSize,
    lineHeight: defaultHeading.lineHeight,
  };

  function createNumberedHeader(number, headingText) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('mjc-numbered-header');

    let stylizedNumber = document.createElement('span');
    stylizedNumber.innerText = String(number);
    stylizedNumber.style = headingStyles;

    let heading = document.createElement('h2');
    heading.innerText = headingText;

    wrapper.appendChild(stylizedNumber);
    wrapper.appendChild(heading);

    return wrapper;
  }

  let heading, numberedHeader;
  for (let i = 1; i < 11; i++) {
    heading = findOnPage(`*${i}* `, 'h2')[0];
    if (!heading) return;

    numberedHeader = createNumberedHeader(i, heading.innerText.split(`*${i}* `)[1]);
    heading.replaceWith(numberedHeader);
  }
}

const externalLink = () => {

  // TODO: REWRITE WITH FINDONPAGE() FUNCTION
  function findAndReplaceLinks(anchorNode) {
    let indexOfPlaceholder, linkText, substrA, substrB;

    linkText = anchorNode.innerHTML.toString();
    indexOfPlaceholder = linkText.search('—&gt;'); // Replaces all instances of --> (em dash + greater than symbol)

    if (indexOfPlaceholder === -1) {
      return;
    }

    substrA = linkText.substr(0, indexOfPlaceholder);
    substrB = linkText.substr(indexOfPlaceholder + 5);

    anchorNode.innerHTML = substrA + '<i class="fas fa-external-link-alt" style="font-size: 0.7em"></i>' + substrB;
  }

  let anchorTags = document.querySelectorAll('a');
  if (anchorTags.length === 0) {
    return;
  }

  for (let i = 0; i < anchorTags.length; i++) {
    findAndReplaceLinks(anchorTags[i]);
  }
}

const secondaryNav = () => {
  // Continue if subnav element exists
  let subnavMarker = findOnPage('Secondary Navigation', 'span')[0];
  if (!subnavMarker) return;

  const sectionId = getSectionId(subnavMarker);
  document.querySelector(`section[data-section-id="${sectionId}"]`).style.minHeight = 'unset';
  document.querySelector(`section[data-section-id="${sectionId}"] .content-wrapper`).style.padding = '0px';
  document.querySelector(`section[data-section-id="${sectionId}"] .fluid-engine`).classList.add('mjc-secondary-nav-fe');

  document.querySelector(`section[data-section-id="${sectionId}"] .code-block`).parentNode.remove();
  const subnavContent = document.querySelector(`section[data-section-id='${sectionId}'] .sqs-block-html .sqs-block-content`);

  const links = subnavContent.querySelectorAll('a');
  const currentHREF = window.location.href;
  links.forEach(link => {
    if (link.href === currentHREF) {
      link.classList.add('mjc-secondary-navigation-active');
    }
  })

  document.querySelector(`section[data-section-id='${sectionId}']`).classList.add('mjc-secondary-navigation-section');

  let nav = document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Secondary menu')
  nav.classList.add('mjc-secondary-nav-wrapper');

  for (let i = 0; i < subnavContent.childNodes.length; i++) {
    nav.append(subnavContent.childNodes[i].cloneNode(true));
  }

  subnavContent.replaceChildren(nav);
}

mjcSqs.config = function () {
  window.onload = () => {
    numberedHeadings();
    externalLink();
    secondaryNav();
  }
}
