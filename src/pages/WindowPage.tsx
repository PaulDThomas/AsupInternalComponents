import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { AsupInternalEditor, AsupInternalWindow } from '../components';

export const WindowPage = () => {
  const [showWindow, setShowWindow] = useState<boolean>(true);
  const [someText, setSomeText] = useState<string>("");

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
              backgroundColor: "cyan",
              width: "100%",
              height: "100%",
              display: "flex",
              flexGrow: 1,
              flexDirection:"column",
            }}>
              <span>h</span>
            </div>


          </AsupInternalWindow>
        </form>
      </div>
    </>
  );
}