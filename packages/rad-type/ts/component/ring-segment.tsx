import * as React from "react";

import * as RadType from "rad-type";

export const RingSegment = React.memo(
  (props: {
    readonly boxSizePx: number;
    readonly offsetPx: number;
    readonly borderThicknessRation: number;
    readonly startRadiusRation: number;
    readonly endRadiusRation: number;
    readonly startLine: RadType.ILineData;
    readonly endLine: RadType.ILineData;
    readonly shouldHighlight: boolean;
  }) => {
    const {
      boxSizePx,
      offsetPx,
      borderThicknessRation,
      startRadiusRation,
      endRadiusRation,
      startLine,
      endLine,
      shouldHighlight,
    } = props;

    const style = React.useMemo(
      () =>
        ({
          position: "absolute",
          fill: shouldHighlight ? "rgba(200, 200, 255, 1)" : "transparent",
          left: offsetPx,
          bottom: offsetPx,
          stroke: "rgb(0,0,0)",
          strokeWidth: borderThicknessRation,
          width: boxSizePx,
          height: boxSizePx,
          transform: "scale(1, -1)",
        } as const),
      [shouldHighlight, offsetPx, borderThicknessRation, boxSizePx],
    );

    const data = React.useMemo(() => {
      const innerStart = {
        X: startLine.cos * startRadiusRation,
        Y: startLine.sin * startRadiusRation,
      } as const;
      const outerStart = {
        X: startLine.cos * endRadiusRation,
        Y: startLine.sin * endRadiusRation,
      } as const;
      const outerEnd = {
        X: endLine.cos * endRadiusRation,
        Y: endLine.sin * endRadiusRation,
      } as const;
      const innerEnd = {
        X: endLine.cos * startRadiusRation,
        Y: endLine.sin * startRadiusRation,
      } as const;

      return (
        `M ${innerStart.X} ${innerStart.Y}` +
        `L ${outerStart.X} ${outerStart.Y}` +
        `A ${endRadiusRation} ${endRadiusRation} 0 0 1 ${outerEnd.X} ${outerEnd.Y}` +
        `L ${innerEnd.X} ${innerEnd.Y}` +
        `A ${startRadiusRation} ${startRadiusRation} 0 0 0 ${innerStart.X} ${innerStart.Y}` +
        `Z`
      );
    }, [startLine, startRadiusRation, endLine, endRadiusRation]);

    return (
      <svg viewBox="-1,-1,2,2" style={style}>
        <path d={data} />
      </svg>
    );
  },
);
