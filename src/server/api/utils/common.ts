export const getObjectValuesForZodEnum = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj);
  if (!values.length) {
    throw new Error('Empty object');
  }
  return [...values] as [T[keyof T], ...T[keyof T][]];
};
