export const range = (first: number, count: number): number[] => {
  const result = [];
  for (let i = first; i < first + count; ++i) {
    result.push(i);
  }
  return result;
};
