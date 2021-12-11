export default function promisify<Type>(callback: Function): Promise<Type> {
  return new Promise(($: Function, _: Function) => {
    setTimeout(async () => {
      try {
        $(await callback());
      } catch (e) {
        _(e);
      }
    });
  });
};
