let container = document.querySelector('html');
let referenceHTMLelement = document.createElement('div');
container.appendChild(referenceHTMLelement);
const defualtComputedStyles = getComputedStyle(referenceHTMLelement);

let reConstructedPage = document.createElement('html');

function traverseHTMLTree(oldPageNode, parentNodeNew) {
  if (
    oldPageNode.tagName !== 'script' &&
    oldPageNode.tagName !== 'SCRIPT' &&
    oldPageNode.tagName !== 'STYLE'
  ) {
    if (oldPageNode.children.length === 0) {
      let computedStyles = getComputedStyle(oldPageNode);
      let allClasses = extractAllClasses(computedStyles);
      parentNodeNew.innerText = oldPageNode.innerText;
      parentNodeNew.className = allClasses;
      if (oldPageNode.tagName === 'IMG') {
        parentNodeNew.src = oldPageNode.src;
      }
    } else {
      for (let i = 0; i < oldPageNode.children.length; i++) {
        parentNodeNew.appendChild(
          document.createElement(oldPageNode.children[i].tagName)
        );
        let computedStyles = getComputedStyle(oldPageNode.children[i]);
        let allClasses = extractAllClasses(computedStyles);
        parentNodeNew.children[i].className = allClasses;
        traverseHTMLTree(oldPageNode.children[i], parentNodeNew.children[i]);
      }
    }
  }
}

let StyleSheetClasses = new Set();

function extractAllClasses(computedStyles) {
  let allClasses = '';

  for (let i = 0; i < computedStyles.length; i++) {
    let propertyVal = computedStyles.item(i);
    if (
      computedStyles.getPropertyValue(propertyVal) !==
      defualtComputedStyles.getPropertyValue(propertyVal)
    ) {
      let customClassName =
        propertyVal +
        '_' +
        computedStyles
          .getPropertyValue(propertyVal)
          .replace(/[^A-Za-z0-9]/g, '');
      allClasses = allClasses + ' ' + customClassName;
      StyleSheetClasses.add({
        property: `${propertyVal} : ${computedStyles.getPropertyValue(
          propertyVal
        )}`,
        classname: customClassName,
      });
    }
  }
  return allClasses;
}

traverseHTMLTree(container, reConstructedPage);

let cssText = '';

StyleSheetClasses.forEach(
  (rule) => (cssText = cssText + `.${rule.classname} { ${rule.property}; } `)
);

var s = document.createElement('style');
s.type = 'text/css';
s.innerText = cssText;

var newHead = document.createElement('head');
reConstructedPage.appendChild(s);

console.log(reConstructedPage, container);
