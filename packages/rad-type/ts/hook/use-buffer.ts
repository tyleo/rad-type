import * as React from "react";

const newArr = <T>(clone: T, size: number): T[] => {
  const res = [];
  for (let i = 0; i < size; ++i) {
    res.push(clone);
  }
  return res;
};

export const useBuffer: {
  <T>(current: T, clone: T, size: number): T[];
  <T>(current: T, arr: T[]): T[];
} = <T>(current: T, cloneOrArr: T | T[], size?: number): T[] => {
  const res = React.useRef<T[] | undefined>(undefined);
  if (res.current === undefined) {
    res.current =
      size === undefined ? (cloneOrArr as T[]) : newArr(cloneOrArr as T, size);
  }
  res.current.shift();
  res.current.push(current);
  return res.current;
};
