import { useState } from 'react';
import { AsupInternalWindow } from '../components/aiw/AsupInternalWindow';

export const WindowPage = (props) => {
  const [showWindow, setShowWindow] = useState(false);

  return (
    <>
      <div style={{
        margin: "1rem",
        padding: "1rem",
        border: "solid black 3px"
      }}>
        <form>
          <label>
            Show Window
            <input
              name="showWindowCheck"
              type="checkbox"
              checked={showWindow}
              onChange={(e) => setShowWindow(e.target.checked)}
            />
          </label>
        </form>
      </div>
      <AsupInternalWindow
        Visible={showWindow}
        Title={"This is the window title"}
      >
        <p>Hello there!</p>
      </AsupInternalWindow>
    </>
  );
}