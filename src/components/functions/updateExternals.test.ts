import { AioExternalReplacements, AioReplacement } from '../aio';
import { updateExternals } from './updateExternals';

describe('Check updateExternals', () => {
  const a: AioReplacement = {
    oldText: 'a',
    externalName: 'ListE',
    newTexts: [{ texts: ['a1', 'a2'] }],
  };
  const b: AioReplacement = {
    oldText: 'b',
    newTexts: [
      {
        texts: ['b1'],
        subLists: [
          {
            oldText: 'c',
            externalName: 'ListE',
            newTexts: [{ texts: ['c1', 'c2'] }],
          },
          { oldText: 'd', newTexts: [{ texts: ['d1', 'd2'] }] },
        ],
      },
    ],
  };
  const e: AioExternalReplacements = {
    givenName: 'ListE',
    newTexts: [
      { texts: ['Mean'], subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['xx.x'] }] }] },
      { texts: ['SD'], subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['x.xx'] }] }] },
    ],
  };

  test('Into single', () => {
    const c = updateExternals([a], [e]);
    expect(c).toEqual([
      {
        oldText: 'a',
        externalName: 'ListE',
        newTexts: [
          {
            texts: ['Mean'],
            subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['xx.x'] }] }],
          },
          { texts: ['SD'], subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['x.xx'] }] }] },
        ],
      },
    ]);
  });

  test('Into long', () => {
    const c = updateExternals([b], [e]);
    expect(c).toEqual([
      {
        oldText: 'b',
        newTexts: [
          {
            texts: ['b1'],
            subLists: [
              {
                oldText: 'c',
                externalName: 'ListE',
                newTexts: [
                  {
                    texts: ['Mean'],
                    subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['xx.x'] }] }],
                  },
                  {
                    texts: ['SD'],
                    subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['x.xx'] }] }],
                  },
                ],
              },
              { oldText: 'd', newTexts: [{ texts: ['d1', 'd2'] }] },
            ],
          },
        ],
      },
    ]);
  });

  test('Into both', () => {
    const c = updateExternals([a, b], [e]);
    expect(c).toEqual([
      {
        oldText: 'a',
        externalName: 'ListE',
        newTexts: [
          {
            texts: ['Mean'],
            subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['xx.x'] }] }],
          },
          { texts: ['SD'], subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['x.xx'] }] }] },
        ],
      },
      {
        oldText: 'b',
        newTexts: [
          {
            texts: ['b1'],
            subLists: [
              {
                oldText: 'c',
                externalName: 'ListE',
                newTexts: [
                  {
                    texts: ['Mean'],
                    subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['xx.x'] }] }],
                  },
                  {
                    texts: ['SD'],
                    subLists: [{ oldText: '!!xvals!!', newTexts: [{ texts: ['x.xx'] }] }],
                  },
                ],
              },
              { oldText: 'd', newTexts: [{ texts: ['d1', 'd2'] }] },
            ],
          },
        ],
      },
    ]);
  });
});
