import React, { useState } from "react";

interface AioDropSelectProps {
  value?: string,
  availableValues?: Array<string>,
  setValue?: (value: string) => void,
}

export const AioDropSelect = ({ value, setValue, availableValues }: AioDropSelectProps): JSX.Element => {

  const [showDrop, setShowDrop] = useState<boolean>(false);

  return (
    <>
      <div>
        <span
          style={{
            marginRight: value !== undefined ? "0.25rem" : "0"
          }}
        >{value}</span>
        {typeof setValue === "function" &&
          <div className="aiox closed" style={{ position: "relative" }}>
            <div className='aiox-button'
              onClick={() => { setShowDrop(!showDrop); }
              }
            />
            {showDrop &&
              <div className="aio-drop-items-holder"
                style={{
                  position: "absolute",
                  zIndex: 2000,
                  left: "1.25rem",
                }}

              >
                <div
                  className="aio-drop-items-inner-holder"
                  style={{
                    position: "relative",
                  }}
                >
                  {
                    availableValues?.map((a, i) =>
                      <div
                        key={i}
                        className={`aio-drop-item`}
                        onClick={e => { setValue(a); setShowDrop(false) }}
                      >
                        {a}
                      </div>
                    )
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </>
  );
}