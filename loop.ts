import promisify from "./promisify.ts";

export default async function loop(condition: Function, callback: Function): Promise<void> {
  if (!await condition()) return;

  await promosify<void>(async () => {
    await callback();
    await loop(condition, callback);
  });
};
