export const atan2 = (x: number, y: number) => {
  const angle = Math.atan2(y, x);
  return angle < 0 ? angle + 2 * Math.PI : angle;
};
