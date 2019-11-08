import * as React from "react";

export const GamepadDot = (props: {
  readonly boxSizePx: number;
  readonly offsetPx: number;
  readonly radiusRation: number;
  readonly x: number;
  readonly y: number;
}) => {
  const style = React.useMemo(
    () =>
      ({
        position: "absolute",
        fill: "black",
        left: props.offsetPx,
        bottom: props.offsetPx,
        strokeWidth: 0,
        width: props.boxSizePx,
        height: props.boxSizePx,
        transform: "scale(1, -1)",
      } as const),
    [props.offsetPx, props.boxSizePx],
  );

  return (
    <svg viewBox="-1,-1,2,2" style={style}>
      <circle cx={props.x} cy={props.y} r={props.radiusRation} />
    </svg>
  );
};
