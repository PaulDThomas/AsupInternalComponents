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
            <div style={{
              border: "black solid 1px",
              minHeight: "250px",
              width: "500px",
              padding: "-2px -2px -2px -2px",
              zIndex: "500",
              backgroundColor: "white",
              borderRadius: "8px",
            }}>
              <p style={{ padding: "0 1rem" }}>Internal Child 1</p>
              <p style={{ padding: "0 1rem" }}>Internal Child 2</p>
              <p style={{ padding: "0 1rem" }}>Internal Child 3</p>
            </div>
          </AsupInternalWindow>
        </form>
      </div>
    </>
  );
}