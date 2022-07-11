import React from "react";

export interface AsupInternalWindowProps {
  aiwid?: number,
  title: string,
  onClose?: () => void,
  style?: React.CSSProperties,
  elements?: null | React.ReactNode,
}

interface AiwContextSettings {
  aiwList: AsupInternalWindowProps[],
  setAiwList?: (ret: AsupInternalWindowProps[]) => void,
  openAiw: (ret: AsupInternalWindowProps) => void,
  closeAiw: (windowId: number) => void,
}

let defaultSettings: AiwContextSettings = {
  aiwList: [],
  closeAiw: (aiwid: number) => {
    console.log(`Bad default function trying to close window ${aiwid}`)
   },
  openAiw: ({ title }) => {
    console.log("Bad default function");
    return -1;
  },
};

export const AiwContext = React.createContext(defaultSettings);