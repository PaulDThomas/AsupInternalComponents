import './aie.css';

export const AieStyleButton = ({ styleName, currentStyle, applyStyleFunction }) => {
  // Apply style on click
  const aieClick = (e) => {
    e.preventDefault();
    applyStyleFunction(styleName);
  }
  const className = "aie-button" + (currentStyle.has(styleName) ? " active" : "");
  return (
    <button className={className} onMouseDown={aieClick} >
      {styleName}
    </button>
  );
}

