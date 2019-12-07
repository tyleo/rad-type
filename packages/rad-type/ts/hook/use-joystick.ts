import * as React from "react";

import * as RadType from "rad-type";

export const useJoystick = (
  gamepadId: number | undefined,
  xAxisId: number,
  yAxisId: number,
) => {
  const [x, setX] = React.useState<number | undefined>();
  const [y, setY] = React.useState<number | undefined>();

  const onGamepad = React.useCallback(
    (gamepad: Gamepad) => {
      let xAxis = gamepad.axes[xAxisId];
      let yAxis = -gamepad.axes[yAxisId];

      let magnitude = Math.sqrt(xAxis * xAxis + yAxis * yAxis);
      if (magnitude <= 1) {
        magnitude = 1;
      }

      if (xAxis !== x) setX(xAxis / magnitude);
      if (yAxis !== y) setY(yAxis / magnitude);
    },
    [xAxisId, yAxisId, x, y],
  );

  RadType.useGamepad(gamepadId, onGamepad);

  return [x, y];
};
