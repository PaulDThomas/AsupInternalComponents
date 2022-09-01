// Utility functions
export const getHtmlString = (arg: DocumentFragment, className: string): string => {
  const d = document.createElement('div');
  d.className = className;
  d.appendChild(arg);
  return d.outerHTML;
};
