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
              onChange={(e) => {
                console.log(`Changing checkbox to ${e.target.checked}`);
                setShowWindow(e.target.checked);
              }}
            />
          </label>
          <AsupInternalWindow
            Visible={showWindow}
            onClose={() => {
              console.log(`Closing window in WindowPage`);
              setShowWindow(false);
            }
            }
            Title={"This is the window title"}
          >
            <p>Hello there!</p>
          </AsupInternalWindow>
        </form>
      </div>
    </>
  );
}