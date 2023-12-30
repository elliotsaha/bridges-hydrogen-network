// given length, it will return the len with the possibly
// pluralized word e.g. pluralize(7, "service(s)") -> 7 services
export const pluralize = (len: number, str: string) => {
  if (len === 1) {
    return `${len} ${str.replaceAll('(s)', '')}`;
  }
  return `${len} ${str.replaceAll('(s)', 's')}`;
};
