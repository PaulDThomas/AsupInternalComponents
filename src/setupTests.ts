// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Move the reload function
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: jest.fn() },
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  document.documentElement.scrollTo = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  let counter = 1000;
  Object.defineProperty(window, "crypto", {
    writable: true,
    value: {
      randomUUID: () => {
        counter++;
        return `${counter}`;
      },
    },
  });
});

afterEach(() => {});

afterAll(() => {});
