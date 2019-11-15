import * as React from "react";

import * as RadType from "rad-type";
import { IVibrationActuator } from "ts/type/i-vibration-actuator";

export const useVibrationActuator = (
  gamepadId: number | undefined,
): RadType.IVibrationActuator | undefined => {
  const [state, setState] = React.useState<IVibrationActuator | undefined>();

  const onGamepad = React.useCallback(
    (gamepad: Gamepad) => {
      const actuator = (gamepad as any).vibrationActuator;
      if (actuator !== state) setState(actuator);
    },
    [state],
  );

  RadType.useGamepad(gamepadId, onGamepad);

  return state;
};
