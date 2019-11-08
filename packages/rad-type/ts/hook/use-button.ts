import * as React from "react";

import * as RadType from "rad-type";

export const useButton = (gamepadId: number | undefined, buttonId: number) => {
  const [state, setState] = React.useState<boolean | undefined>();

  const onGamepad = React.useCallback(
    (gamepad: Gamepad) => {
      const button = gamepad.buttons[buttonId];

      if (button.pressed !== state) setState(button.pressed);
    },
    [buttonId, state],
  );

  RadType.useGamepad(gamepadId, onGamepad);

  return state;
};
