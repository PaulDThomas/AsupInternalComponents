import React, { useCallback, useEffect, useRef, useState } from "react";
import './aioIconButton.css';
import './aio.css';

interface AioIconButtonProps {
  onClick: (ret: string) => void
  iconName?: string,
  menuItems?: string[],
  leftOffset?: string,
}

export const AioIconButton = ({ onClick, iconName, menuItems, leftOffset }: AioIconButtonProps): JSX.Element => {

  // Boolean to show menu
  const [showDrop, setShowDrop] = useState<boolean>(false);

  // Set up outsideClick handler
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle click off the menu
  const handleClick = useCallback((e: MouseEvent) => {
    if (menuRef.current && (
      (e.target instanceof Element && !menuRef.current?.contains(e.target))
      || !(e.target instanceof Element)
    )) {
      setShowDrop(false);
    }
  }, []);

  // Update the document click handler
  useEffect(() => {
    if (showDrop) document.addEventListener('mousedown', handleClick);
    else document.removeEventListener('mousedown', handleClick);
  }, [handleClick, showDrop]);

  return (
    <div className="aio-button-holder">
      <div className={`aiox-button ${iconName ?? "aiox-down"}`}
        onClick={() => {
          // Just click if there is no drop down
          if (!menuItems || menuItems.length <= 1) {
            onClick(menuItems?.length === 1 ? menuItems[0] : "");
          }
          // Or show/hide the dropdown
          else {
            setShowDrop(!showDrop);
          }
        }}
      />
      {showDrop &&
        <div ref={menuRef} className="aio-drop-items-holder" style={{ left: leftOffset ?? "1.25rem", }}>
          <div className="aio-drop-items-inner-holder">
            {menuItems?.map((a, i) =>
              <div key={i} className={`aio-drop-item`} onClick={e => { onClick(a); setShowDrop(false); }}>
                {a.replace(/ /g, "\u00A0")}
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}