import * as RadType from "rad-type";

export const calcAngleIndex = (
  x: number,
  y: number,
  angleIncrement: number,
  angleOffset: number,
) =>
  Math.floor(
    RadType.negToPosDeg(RadType.radToDeg(RadType.atan2(x, y)) - angleOffset) /
      angleIncrement,
  );
