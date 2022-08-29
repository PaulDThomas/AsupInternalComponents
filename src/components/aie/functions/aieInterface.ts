// Interfaces
export interface iColourStyles {
  [styleName: string]: React.CSSProperties;
}

export interface iStyleBlock {
  start: number;
  end: number;
  styleName?: string;
}

export interface iColouredLine {
  text: string;
  styles?: iColourStyles;
  styleBlocks?: iStyleBlock[];
}

export interface AieStyleMap {
  [styleName: string]: { css: React.CSSProperties; aieExclude: string[] };
}
export interface AieStyleExcludeMap {
  [styleName: string]: string[];
}
