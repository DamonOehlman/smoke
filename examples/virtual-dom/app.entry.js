import {
  h,
  diff,
  patch,
  createElement
} from 'virtual-dom';

const render = (count) => {
  return h('div', {
    style: {
      textAlign: 'center',
      lineHeight: (100 + count) + 'px',
      border: '1px solid red',
      width: (100 + count) + 'px',
      height: (100 + count) + 'px'
    }
  }, [String(count)]);
};

let count = 0;
let tree = render(count);
let rootNode = createElement(tree);
document.body.appendChild(rootNode);

setInterval(() => {
  count += 1;

  const newTree = render(count);
  const patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
}, 1000);
