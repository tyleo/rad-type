import * as React from "react";

import * as RadType from "rad-type";

export const RadTypeVis = (props: {
  // # Style
  readonly boxSizePx: number;
  readonly lineThicknessPx: number;
  readonly fontSize: number;
  // ## Keys
  readonly centerKey: string;
  readonly keys: string[];
  // ## Circles
  readonly targetCircleRadiusRation: number;
  readonly letterCircleRadiusRation: number;
  readonly tinyCircleRadiusRation: number;
  readonly gamepadDotRadiusRation: number;
  readonly angleOffsetMultiplier: number;
  // # Behavior
  readonly gamepadId: number | undefined;
  readonly xAxisId: number;
  readonly yAxisId: number;
  readonly altButtonId: number;
  // ## Callbacks
  readonly appendLetter: (letter: string) => void;
}) => {
  const {
    boxSizePx,
    lineThicknessPx,
    fontSize,
    centerKey,
    keys,
    targetCircleRadiusRation,
    letterCircleRadiusRation,
    tinyCircleRadiusRation,
    gamepadDotRadiusRation,
    angleOffsetMultiplier,
    gamepadId,
    xAxisId,
    yAxisId,
    altButtonId,
    appendLetter,
  } = props;
  const targetRadiusRationSq =
    targetCircleRadiusRation * targetCircleRadiusRation;
  const tinyRadiusRationSq = tinyCircleRadiusRation * tinyCircleRadiusRation;
  const segmentAngle = 360 / keys.length;
  const segmentOffset = segmentAngle * angleOffsetMultiplier;

  const halfLineThicknessPx = lineThicknessPx / 2;
  const actualBoxSizePx = boxSizePx + lineThicknessPx;
  const halfBoxSizePx = actualBoxSizePx / 2;
  const offsetPx = -(actualBoxSizePx / 2);
  const actualBorderThicknessRation = lineThicknessPx / actualBoxSizePx;
  const actualGamepadDotRadiusRation =
    (gamepadDotRadiusRation * boxSizePx) / actualBoxSizePx;

  const actualOuterRadiusRation =
    (boxSizePx + halfLineThicknessPx) / actualBoxSizePx;
  const actualTargetRadiusRation =
    (targetCircleRadiusRation * boxSizePx + halfLineThicknessPx) /
    actualBoxSizePx;
  const actualTinyRadiusRation =
    (tinyCircleRadiusRation * boxSizePx + halfLineThicknessPx) /
    actualBoxSizePx;
  const letterRadiusPx =
    ((letterCircleRadiusRation + targetCircleRadiusRation) / 2) * halfBoxSizePx;

  const [x, y] = RadType.useJoystick(gamepadId, xAxisId, yAxisId);

  const xOrZero = x === undefined ? 0 : x;
  const yOrZero = y === undefined ? 0 : y;
  const magnitudeSq = xOrZero * xOrZero + yOrZero * yOrZero;

  const bufferSize = 2;
  const isOutsideOfCenter = magnitudeSq > targetRadiusRationSq;
  const bufferedIsOutsideOfCenter = RadType.useBuffer(
    isOutsideOfCenter,
    isOutsideOfCenter,
    bufferSize,
  );
  const hasRecentlyBeenOutsideOfCenter = bufferedIsOutsideOfCenter.reduce(
    (prev, current) => prev || current,
    false,
  );

  const dotIndexKey = isOutsideOfCenter
    ? (() => {
        const dotIndex = RadType.calcAngleIndex(
          xOrZero,
          yOrZero,
          segmentAngle,
          segmentOffset,
        );
        return {
          dotIndex,
          key: keys[(dotIndex + 1) % keys.length],
        };
      })()
    : { dotIndex: undefined, key: undefined };

  const bufferedKeys = RadType.useBuffer(
    dotIndexKey.key,
    dotIndexKey.key,
    bufferSize + 1,
  );
  const key = bufferedKeys[0];

  const isInTinyZone = magnitudeSq <= tinyRadiusRationSq;

  const actualX = (xOrZero * boxSizePx) / actualBoxSizePx;
  const actualY = (yOrZero * boxSizePx) / actualBoxSizePx;

  const vibrationActuator = RadType.useVibrationActuator(gamepadId);
  const appendAndRumble = React.useCallback(
    (letter: string) => {
      if (vibrationActuator !== undefined) {
        vibrationActuator.playEffect("dual-rumble", {
          duration: 50,
          strongMagnitude: 1,
          weakMagnitude: 1,
        });
      }
      appendLetter(letter);
    },
    [vibrationActuator, appendLetter],
  );

  React.useEffect(() => {
    if (!hasRecentlyBeenOutsideOfCenter && key !== undefined) {
      appendAndRumble(key);
    }
  }, [key, appendAndRumble, hasRecentlyBeenOutsideOfCenter]);

  const onAltButtonChanged = React.useCallback(
    () => (isInTinyZone ? appendAndRumble(centerKey) : {}),
    [appendAndRumble, centerKey, isInTinyZone],
  );
  RadType.useButtonEvents(
    gamepadId,
    altButtonId,
    undefined,
    onAltButtonChanged,
  );

  return (
    <div
      className={RadType.emo.radTypeContainerRelativeContainer(actualBoxSizePx)}
    >
      <div className={RadType.emo.radTypeContainerAbsoluteContainer(-offsetPx)}>
        <RadType.Circle
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          radiusRation={actualTinyRadiusRation}
          shouldHighlight={isInTinyZone}
        />

        <RadType.RingSegments
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          startRadiusRation={actualTargetRadiusRation}
          endRadiusRation={actualOuterRadiusRation}
          numSegments={keys.length}
          segmentAngle={segmentAngle}
          segmentOffset={segmentOffset}
          highlightedSegment={dotIndexKey.dotIndex}
        />

        <RadType.LetterRing
          letters={keys}
          angle={segmentAngle}
          offset={0}
          radiusPx={letterRadiusPx}
          fontSize={fontSize}
          color={"rgb(0, 0, 0)"}
        />

        <div className={RadType.emo.letter(fontSize, "rgb(0, 0, 0)")}>
          {centerKey}
        </div>

        <RadType.GamepadDot
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          radiusRation={actualGamepadDotRadiusRation}
          x={actualX}
          y={actualY}
        />
      </div>
    </div>
  );
};
