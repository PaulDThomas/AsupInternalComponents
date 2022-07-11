import React, { useCallback, useState } from "react";
import { AiwContext, AsupInternalWindowProps } from "./aiwContext";
import { AsupInternalWindow } from "./AsupInternalWindow";

export const AsupInternalWindowProvider = ({ children }: { children: null | React.ReactNode }): JSX.Element => {

  const [aiwList, setAiwList] = useState<AsupInternalWindowProps[]>([]);

  // Add window with new parameters
  const openAiw = useCallback((aiw: AsupInternalWindowProps) => {
    let newAiw = { ...aiw, aiwid:aiwList.length > 0 ? Math.max(...aiwList.map(w => w.aiwid ?? 0)) + 1 : 1 }
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
      {aiwList.map((w,i) =>
        <AsupInternalWindow
          key={w.aiwid ?? i}
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
    </AiwContext.Provider>
  );
}