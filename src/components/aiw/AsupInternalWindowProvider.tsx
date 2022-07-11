import React, { useCallback, useState } from "react";
import { AiwContext, AsupInternalWindowProps } from "./aiwContext";
import { AsupInternalWindow } from "./AsupInternalWindow";

export const AsupInternalWindowProvider = ({ children }: { children: null | React.ReactNode }): JSX.Element => {

  const [aiwList, setAiwList] = useState<AsupInternalWindowProps[]>([]);
  const [mousePosn, setMousePosn] = useState<{ x: number, y: number }>({ x: -1, y: -1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      let x = e.clientX - e.currentTarget.offsetLeft;
      let y = e.clientY - e.currentTarget.offsetTop;
      setMousePosn({ x, y });
    }
  }

  // Add window with new parameters
  const openAiw = useCallback((aiw: AsupInternalWindowProps) => {
    let newAiw = { ...aiw, aiwid: aiwList.length > 0 ? Math.max(...aiwList.map(w => w.aiwid ?? 0)) + 1 : 1 }
    let newAiwList = [...aiwList, newAiw];
    setAiwList(newAiwList);
  }, [aiwList]);

  // Remove window from the list
  const closeAiw = useCallback((aiwid: number) => {
    setAiwList(aiwList.filter(w => w.aiwid !== aiwid));
  }, [aiwList]);

  // Add list of windows
  return (
    <AiwContext.Provider value={{ aiwList, openAiw, closeAiw }}>
      <div onMouseMove={handleMouseMove}>
        {aiwList.map((w, i) =>
          <AsupInternalWindow
            key={w.aiwid ?? i}
            x={mousePosn.x}
            y={mousePosn.y}
            title={w.title}
            style={w.style}
            elements={w.elements}
            onClose={() => {
              if (typeof w.onClose === "function") w.onClose();
              closeAiw(w.aiwid ?? -1);
            }}
          />
        )}
        {children}
      </div>
    </AiwContext.Provider>
  );
}