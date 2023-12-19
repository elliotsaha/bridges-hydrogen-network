// creates object with omitted key
export const omit = <T extends object>(key: keyof T, obj: T) => {
  return Object.fromEntries(Object.entries(obj).filter(e => e[0] !== key));
};
