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
      const xAxis = gamepad.axes[xAxisId];
      const yAxis = -gamepad.axes[yAxisId];

      if (xAxis !== x) setX(xAxis);
      if (yAxis !== y) setY(yAxis);
    },
    [xAxisId, yAxisId, x, y],
  );

  RadType.useGamepad(gamepadId, onGamepad);

  return [x, y];
};
