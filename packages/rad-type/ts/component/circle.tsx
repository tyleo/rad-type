import * as React from "react";

export const Circle = React.memo(
  (props: {
    readonly boxSizePx: number;
    readonly offsetPx: number;
    readonly borderThicknessRation: number;
    readonly radiusRation: number;
    readonly shouldHighlight: boolean;
  }) => {
    const style = React.useMemo(
      () =>
        ({
          position: "absolute",
          fill: props.shouldHighlight
            ? "rgba(200, 200, 255, 1)"
            : "transparent",
          left: props.offsetPx,
          bottom: props.offsetPx,
          stroke: "black",
          strokeWidth: props.borderThicknessRation,
          width: props.boxSizePx,
          height: props.boxSizePx,
          transform: "scale(1, -1)",
        } as const),
      [
        props.shouldHighlight,
        props.offsetPx,
        props.borderThicknessRation,
        props.boxSizePx,
      ],
    );

    return (
      <svg viewBox="-1,-1,2,2" style={style}>
        <circle cx={0} cy={0} r={props.radiusRation} />
      </svg>
    );
  },
);
