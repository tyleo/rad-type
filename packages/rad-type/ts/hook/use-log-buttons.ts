import * as React from "react";

import * as RadType from "rad-type";

export const useLogButtons = (gamepadId: number | undefined) => {
  const onGamepad = React.useCallback((gamepad: Gamepad) => {
    let str = gamepad.buttons.reduce((prev, current, index) => {
      prev = `${prev}${index}: ${current.pressed}, `;
      return prev;
    }, "{ ");
    if (gamepad.buttons.length > 0) {
      str = str.slice(0, -2);
      str = `${str} `;
    }
    str = `${str}}`;
    console.log(str);
  }, []);

  RadType.useGamepad(gamepadId, onGamepad);
};
