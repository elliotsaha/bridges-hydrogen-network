// checks if array has duplicate items
export const hasDuplicates = (arr: Array<unknown>) =>
  arr.length !== new Set(arr).size;
