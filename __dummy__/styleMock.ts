export default new Proxy(
  {},
  {
    get: (target, name) => name,
  },
);
