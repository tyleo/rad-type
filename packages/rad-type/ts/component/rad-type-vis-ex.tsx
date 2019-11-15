import * as React from "react";

import * as RadType from "rad-type";

export const RadTypeVisEx = (props: {
  // # Style
  readonly boxSizePx: number;
  readonly lineThicknessPx: number;
  readonly fontSize: number;
  // ## Keys
  readonly centerKey: string;
  readonly defaultKeys: string[];
  readonly altKeys: string[];
  // ## Circles
  readonly targetCircleRadiusRation: number;
  readonly letterCircleRadiusRation: number;
  readonly altLetterCircleRadiusRation: number;
  readonly tinyCircleRadiusRation: number;
  readonly gamepadDotRadiusRation: number;
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
    defaultKeys,
    altKeys,
    gamepadDotRadiusRation,
    letterCircleRadiusRation,
    altLetterCircleRadiusRation,
    targetCircleRadiusRation,
    tinyCircleRadiusRation,
    gamepadId,
    xAxisId,
    yAxisId,
    altButtonId,
    appendLetter,
  } = props;
  const targetRadiusRationSq =
    targetCircleRadiusRation * targetCircleRadiusRation;
  const tinyRadiusRationSq = tinyCircleRadiusRation * tinyCircleRadiusRation;
  const defaultSegmentAngle = 360 / defaultKeys.length;
  const defaultSegmentOffset = defaultSegmentAngle * 0.5;

  const altSegmentAngle = 360 / altKeys.length;
  const altSegmentOffset = altSegmentAngle / 2;

  const halfLineThicknessPx = lineThicknessPx / 2;
  const actualBoxSizePx = boxSizePx + lineThicknessPx;
  const halfBoxSizePx = actualBoxSizePx / 2;
  const offsetPx = -halfBoxSizePx;
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
  const altLetterRadiusPx =
    ((altLetterCircleRadiusRation + letterCircleRadiusRation) / 2) *
    halfBoxSizePx;

  const [x, y] = RadType.useJoystick(gamepadId, xAxisId, yAxisId);
  const xOrZero = x === undefined ? 0 : x;
  const yOrZero = y === undefined ? 0 : y;
  const magnitudeSq = xOrZero * xOrZero + yOrZero * yOrZero;

  const altButton = RadType.useButton(gamepadId, altButtonId);
  const actualAltButton = altButton === undefined ? false : altButton;

  const blackColor = "rgb(0, 0, 0)";
  const greyColor = "rgb(179, 179, 179)";

  const defaultDotIndex =
    !actualAltButton && magnitudeSq > targetRadiusRationSq
      ? RadType.calcAngleIndex(
          xOrZero,
          yOrZero,
          defaultSegmentAngle,
          defaultSegmentOffset,
        )
      : undefined;
  const altDotIndex =
    actualAltButton && magnitudeSq > targetRadiusRationSq
      ? RadType.calcAngleIndex(
          xOrZero,
          yOrZero,
          altSegmentAngle,
          altSegmentOffset,
        )
      : undefined;

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

  const { defaultLetterColor, altLetterColor } = actualAltButton
    ? {
        defaultLetterColor: greyColor,
        altLetterColor: blackColor,
      }
    : {
        defaultLetterColor: blackColor,
        altLetterColor: greyColor,
      };

  const lastDefaultDotIndex = React.useRef(defaultDotIndex);
  React.useEffect(() => {
    if (
      defaultDotIndex === undefined &&
      lastDefaultDotIndex.current !== defaultDotIndex &&
      !altButton
    ) {
      const key =
        defaultKeys[(lastDefaultDotIndex.current + 1) % defaultKeys.length];
      appendAndRumble(key);
    }
    lastDefaultDotIndex.current = defaultDotIndex;
  }, [defaultDotIndex, defaultKeys, appendAndRumble, altButton]);

  const [enteredAltKey, setEnteredAltKey] = React.useState(false);

  const lastAltDotIndex = React.useRef(altDotIndex);
  React.useEffect(() => {
    if (
      altDotIndex === undefined &&
      lastAltDotIndex.current !== altDotIndex &&
      altButton
    ) {
      const key = altKeys[(lastAltDotIndex.current + 1) % altKeys.length];
      appendAndRumble(key);
      setEnteredAltKey(true);
    }
    lastAltDotIndex.current = altDotIndex;
  }, [altDotIndex, altKeys, appendAndRumble, altButton]);

  const onAltButtonPressed = React.useCallback(
    () => setEnteredAltKey(false),
    [],
  );
  const onAltButtonReleased = React.useCallback(
    () => (isInTinyZone && !enteredAltKey ? appendLetter(centerKey) : {}),
    [appendLetter, centerKey, isInTinyZone, enteredAltKey],
  );
  RadType.useButtonEvents(
    gamepadId,
    altButtonId,
    onAltButtonPressed,
    onAltButtonReleased,
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
        {actualAltButton ? (
          <RadType.RingSegments
            boxSizePx={actualBoxSizePx}
            offsetPx={offsetPx}
            borderThicknessRation={actualBorderThicknessRation}
            startRadiusRation={actualTargetRadiusRation}
            endRadiusRation={actualOuterRadiusRation}
            numSegments={altKeys.length}
            segmentAngle={altSegmentAngle}
            segmentOffset={altSegmentOffset}
            highlightedSegment={altDotIndex}
          />
        ) : (
          <RadType.RingSegments
            boxSizePx={actualBoxSizePx}
            offsetPx={offsetPx}
            borderThicknessRation={actualBorderThicknessRation}
            startRadiusRation={actualTargetRadiusRation}
            endRadiusRation={actualOuterRadiusRation}
            numSegments={defaultKeys.length}
            segmentAngle={defaultSegmentAngle}
            segmentOffset={defaultSegmentOffset}
            highlightedSegment={defaultDotIndex}
          />
        )}

        <RadType.LetterRing
          letters={defaultKeys}
          angle={defaultSegmentAngle}
          offset={0}
          radiusPx={letterRadiusPx}
          fontSize={fontSize}
          color={defaultLetterColor}
        />

        <RadType.LetterRing
          letters={altKeys}
          angle={altSegmentAngle}
          offset={0}
          radiusPx={altLetterRadiusPx}
          fontSize={fontSize}
          color={altLetterColor}
        />

        <div
          className={RadType.emo.letter(
            fontSize,
            actualAltButton ? blackColor : greyColor,
          )}
        >
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
