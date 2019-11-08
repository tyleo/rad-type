import * as React from "react";

import * as RadType from "rad-type";

export const useButtonEvents = (
  gamepadId: number | undefined,
  buttonId: number,
  onPress?: () => void,
  onRelease?: () => void,
) => {
  const button = RadType.useButton(gamepadId, buttonId);
  const onButtonChanged = React.useCallback(
    (prev: boolean | undefined, current: boolean | undefined) => {
      prev = prev === undefined ? false : prev;
      current = current === undefined ? false : current;
      if (prev !== current) {
        if (current) {
          if (onPress) onPress();
        } else {
          if (onRelease) onRelease();
        }
      }
    },
    [onPress, onRelease],
  );
  RadType.useChangeEvent(button, onButtonChanged);
};
