import {getHtmlString} from '..';

describe('Test HTML string function', () => {

  let text = ".asldijfha;sdljfh";
  let frag = document.createDocumentFragment();
  let s = document.createElement('span');
  s.textContent = text;
  frag.appendChild(s);

  test('Check out div assigned', async () => {
    expect(getHtmlString(frag, 'a-new-class')).toBe(`<div class="a-new-class"><span>${text}</span></div>`);
  });

})