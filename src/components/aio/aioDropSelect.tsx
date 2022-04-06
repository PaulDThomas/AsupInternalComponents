import React, { useCallback, useEffect, useRef, useState } from "react";

interface AioDropSelectProps {
  value?: string,
  availableValues?: Array<string>,
  setValue?: (value: string) => void,
}

export const AioDropSelect = ({ value, setValue, availableValues }: AioDropSelectProps): JSX.Element => {

  const [showDrop, setShowDrop] = useState<boolean>(false);

  // Set up outsideClick handler
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback((e: MouseEvent) => {
    if (menuRef.current && (
      (e.target instanceof Element && !menuRef.current?.contains(e.target))
      || !(e.target instanceof Element)
    )) {
      setShowDrop(false);
    }
  }, []);

  useEffect(() => {
    if (showDrop) document.addEventListener('mousedown', handleClick);
    else document.removeEventListener('mousedown', handleClick);
  }, [handleClick, showDrop]);

  return (
    <>
      <div>
        <span
          style={{
            marginRight: value !== undefined ? "0.25rem" : "0"
          }}
        >{value}</span>
        {typeof setValue === "function" && (availableValues?.length ?? 0) > 1 &&
          <div className="aiox closed" style={{ position: "relative" }}>
            <div className='aiox-button'
              onClick={() => { setShowDrop(!showDrop); }
              }
            />
            {showDrop &&
              <div className="aio-drop-items-holder" ref={menuRef}
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
                        onClick={e => { setValue(a); setShowDrop(false); }}
                      >
                        {a.replace(/ /g, "\u00A0")}
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