import * as React from "react";

export const useGamepad = (
  gamepadId: number | undefined,
  gamepadCallback: (gamepad: Gamepad) => void,
) => {
  const animationFrameRef = React.useRef<number | undefined>();

  React.useEffect(() => {
    if (gamepadId === undefined) return;

    const updateGamepad = () => {
      const gamepad = navigator.getGamepads()[gamepadId];
      if (gamepad === null) return;

      gamepadCallback(gamepad);

      animationFrameRef.current = requestAnimationFrame(updateGamepad);
    };

    animationFrameRef.current = requestAnimationFrame(updateGamepad);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gamepadId, gamepadCallback]);
};
