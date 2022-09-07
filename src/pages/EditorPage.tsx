import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AsupInternalEditor } from '../components';

export const EditorPage = () => {
  const [text1, setText1] = useState(
    '<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  work</div>',
  );
  const [text2, setText2] = useState(
    '<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  work</div>',
  );
  const [text3, setText3] = useState(
    '<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  work</div>',
  );
  const [text4, setText4] = useState(
    '<div classname="aie-text" data-inline-style-ranges="[{&quot;offset&quot;:0,&quot;length&quot;:5,&quot;style&quot;:&quot;Notes&quot;}]"><span classname="Notes" style="color:blue;font-size:16pt">Notes</span>  work</div>',
  );

  const dothing = () => {
    console.log('Update');
    const newThing = '<p color="red">Here</p><span style="color:red">ref</span>';
    setText4(newThing);
  };

  const save = () => {
    window.localStorage.setItem('content', JSON.stringify({ text1, text2, text3, text4 }));
    console.log('Saved: ');
    console.log(text1);
    console.log(text2);
    console.log(text3);
    console.log(text4);
  };

  const load = () => {
    const saved = JSON.parse(window.localStorage.getItem('content') ?? '');
    setText1(saved.text1);
    setText2(saved.text2);
    setText3(saved.text3);
    setText4(saved.text4);
  };

  const thisStyleMap = {
    Editable: {
      css: { color: 'red', fontFamily: 'courier', fontSize: '16pt' },
      aieExclude: ['Optional', 'Notes'],
    },
    Optional: {
      css: { color: 'green', fontWeight: '100', fontFamily: 'serif', fontSize: '16pt' },
      aieExclude: ['Editable', 'Notes'],
    },
    Notes: { css: { color: 'blue', fontSize: '16pt' }, aieExclude: ['Editable', 'Optional'] },
  };

  const locn = useLocation();

  return (
    <div
      style={{
        margin: '1rem',
        padding: '1rem',
      }}
    >
      <table>
        <tbody>
          <tr>
            <td>
              <AsupInternalEditor
                value={text1}
                setValue={setText1}
                showStyleButtons={true}
                style={{ width: '195px', height: '100%' }}
                textAlignment={'left'}
                styleMap={thisStyleMap}
              />
            </td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <AsupInternalEditor
                value={text2}
                setValue={setText2}
                showStyleButtons={true}
                style={{ width: '195px', height: '100%' }}
                textAlignment={'decimal'}
                styleMap={thisStyleMap}
              />
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <AsupInternalEditor
                value={text3}
                setValue={setText3}
                showStyleButtons={true}
                style={{ width: '196px', height: '100%' }}
                textAlignment={'center'}
                styleMap={thisStyleMap}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <AsupInternalEditor
        value={text4}
        setValue={setText4}
        showStyleButtons={true}
        style={{ width: '600px', height: '100%' }}
        textAlignment={'right'}
        styleMap={thisStyleMap}
      />

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          border: 'solid black 3px',
        }}
      >
        <div>Current location is... {locn.pathname}</div>
        <button onClick={dothing}>set</button>
        <button onClick={save}>save</button>
        <button onClick={load}>load</button>
        <h5>Text</h5>
        <pre>{text1}</pre>
        <pre>{text2}</pre>
        <pre>{text3}</pre>
        <pre>{text4}</pre>
        <h5>HTML</h5>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: text1 }}
        ></p>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: text2 }}
        ></p>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: text3 }}
        ></p>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: text4 }}
        ></p>
      </div>
    </div>
  );
};
