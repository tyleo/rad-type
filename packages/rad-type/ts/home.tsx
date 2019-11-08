import * as React from "react";

import * as Emotion from "emotion";

import * as RadType from "rad-type";

const emo = {
  radTypeContainerRelativeContainer: (sizePx: number) => Emotion.css`
    height: ${sizePx}px;
    width: ${sizePx}px;
    position: relative;
  `,

  radTypeContainerAbsoluteContainer: (offsetPx: number) => Emotion.css`
    left: ${offsetPx}px;
    bottom: ${offsetPx}px;
    position: absolute;
  `,

  circle: (size: number) => Emotion.css`
    height: ${size}px;
    width: ${size}px;
    min-height: ${size}px;
    min-width: ${size}px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  `,

  flexJustified: () => Emotion.css`
    display: flex;
    justify-content: center;
  `,

  row: (heightPx: number) => Emotion.css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: ${heightPx}px;
  `,

  rowWidthed: (widthPx: number, heightPx: number) => Emotion.css`
    ${emo.row(heightPx)};
    width: ${widthPx}px;
  `,

  letter: (fontSize: number, color: string) => Emotion.css`
    ${emo.text(fontSize)};
    color: ${color};
    display: flex;
    line-height: 0px;
    position: absolute;
    justify-content: center;
    width: 0px;
  `,

  circleItem: (angleDeg: number, radius: number) => {
    const angleRad = RadType.degToRad(angleDeg);
    return Emotion.css`
      position: absolute;
      left: ${radius * Math.cos(angleRad)}px;
      bottom: ${radius * Math.sin(angleRad)}px;
    `;
  },

  text: (fontSize: number) => Emotion.css`
    font-family: "Arial Rounded MT Bold";
    font-size: ${fontSize}px;
  `,

  vertical: () => Emotion.css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
  `,
} as const;

const Circle = React.memo(
  (props: {
    readonly boxSizePx: number;
    readonly offsetPx: number;
    readonly borderThicknessRation: number;
    readonly radiusRation: number;
    readonly shouldHighlight: boolean;
  }) => {
    const style = React.useMemo(
      () =>
        ({
          position: "absolute",
          fill: props.shouldHighlight
            ? "rgba(200, 200, 255, 1)"
            : "transparent",
          left: props.offsetPx,
          bottom: props.offsetPx,
          stroke: "black",
          strokeWidth: props.borderThicknessRation,
          width: props.boxSizePx,
          height: props.boxSizePx,
          transform: "scale(1, -1)",
        } as const),
      [
        props.shouldHighlight,
        props.offsetPx,
        props.borderThicknessRation,
        props.boxSizePx,
      ],
    );

    return (
      <svg viewBox="-1,-1,2,2" style={style}>
        <circle cx={0} cy={0} r={props.radiusRation} />
      </svg>
    );
  },
);

const RingSegment = React.memo(
  (props: {
    readonly boxSizePx: number;
    readonly offsetPx: number;
    readonly borderThicknessRation: number;
    readonly startRadiusRation: number;
    readonly endRadiusRation: number;
    readonly startLine: RadType.ILineData;
    readonly endLine: RadType.ILineData;
    readonly shouldHighlight: boolean;
  }) => {
    const {
      boxSizePx,
      offsetPx,
      borderThicknessRation,
      startRadiusRation,
      endRadiusRation,
      startLine,
      endLine,
      shouldHighlight,
    } = props;

    const style = React.useMemo(
      () =>
        ({
          position: "absolute",
          fill: shouldHighlight ? "rgba(200, 200, 255, 1)" : "transparent",
          left: offsetPx,
          bottom: offsetPx,
          stroke: "rgb(0,0,0)",
          strokeWidth: borderThicknessRation,
          width: boxSizePx,
          height: boxSizePx,
          transform: "scale(1, -1)",
        } as const),
      [shouldHighlight, offsetPx, borderThicknessRation, boxSizePx],
    );

    const data = React.useMemo(() => {
      const innerStart = {
        X: startLine.cos * startRadiusRation,
        Y: startLine.sin * startRadiusRation,
      } as const;
      const outerStart = {
        X: startLine.cos * endRadiusRation,
        Y: startLine.sin * endRadiusRation,
      } as const;
      const outerEnd = {
        X: endLine.cos * endRadiusRation,
        Y: endLine.sin * endRadiusRation,
      } as const;
      const innerEnd = {
        X: endLine.cos * startRadiusRation,
        Y: endLine.sin * startRadiusRation,
      } as const;

      return (
        `M ${innerStart.X} ${innerStart.Y}` +
        `L ${outerStart.X} ${outerStart.Y}` +
        `A ${endRadiusRation} ${endRadiusRation} 0 0 1 ${outerEnd.X} ${outerEnd.Y}` +
        `L ${innerEnd.X} ${innerEnd.Y}` +
        `A ${startRadiusRation} ${startRadiusRation} 0 0 0 ${innerStart.X} ${innerStart.Y}` +
        `Z`
      );
    }, [startLine, startRadiusRation, endLine, endRadiusRation]);

    return (
      <svg viewBox="-1,-1,2,2" style={style}>
        <path d={data} />
      </svg>
    );
  },
);

const RingSegments = React.memo(
  (props: {
    readonly boxSizePx: number;
    readonly offsetPx: number;
    readonly borderThicknessRation: number;
    readonly startRadiusRation: number;
    readonly endRadiusRation: number;
    readonly numSegments: number;
    readonly segmentAngle: number;
    readonly segmentOffset: number;
    readonly highlightedSegment: number | undefined;
  }) => {
    const {
      boxSizePx,
      offsetPx,
      borderThicknessRation,
      startRadiusRation,
      endRadiusRation,
      numSegments,
      segmentAngle,
      segmentOffset,
      highlightedSegment,
    } = props;

    const lineData: readonly RadType.ILineData[] = React.useMemo(
      () =>
        RadType.range(0, numSegments).map(i => {
          const angle = RadType.degToRad(i * segmentAngle + segmentOffset);
          return {
            cos: Math.cos(angle),
            sin: Math.sin(angle),
          } as const;
        }),
      [numSegments, segmentAngle, segmentOffset],
    );

    const RingSegmentMemo = React.useCallback(
      (props: {
        readonly startLine: RadType.ILineData;
        readonly endLine: RadType.ILineData;
        readonly shouldHightlight: boolean;
      }) => {
        return (
          <RingSegment
            boxSizePx={boxSizePx}
            offsetPx={offsetPx}
            borderThicknessRation={borderThicknessRation}
            startRadiusRation={startRadiusRation}
            endRadiusRation={endRadiusRation}
            startLine={props.startLine}
            endLine={props.endLine}
            shouldHighlight={props.shouldHightlight}
          />
        );
      },
      [
        boxSizePx,
        offsetPx,
        borderThicknessRation,
        startRadiusRation,
        endRadiusRation,
      ],
    );

    return (
      <>
        {RadType.range(0, numSegments).map(i => (
          <RingSegmentMemo
            key={i}
            startLine={lineData[i]}
            endLine={lineData[(i + 1) % numSegments]}
            shouldHightlight={highlightedSegment === i}
          />
        ))}
      </>
    );
  },
);

export const ElementRing = React.memo(
  (props: {
    readonly nodes: readonly React.ReactNode[];
    readonly angle: number;
    readonly offset: number;
    readonly radiusPx: number;
  }) => {
    const circleItem = React.useCallback(
      (item: React.ReactNode, angle: number, index: number) => {
        const style = emo.circleItem(angle, props.radiusPx);
        return (
          <div key={index} className={style}>
            {item}
          </div>
        );
      },
      [props.radiusPx],
    );
    return (
      <>
        {props.nodes.map((i, index) =>
          circleItem(i, index * props.angle + props.offset, index),
        )}
      </>
    );
  },
);

export const LetterRing = React.memo(
  (props: {
    readonly letters: string[];
    readonly angle: number;
    readonly offset: number;
    readonly radiusPx: number;
    readonly fontSize: number;
    readonly color: string;
  }) => {
    const circleLetter = React.useMemo(
      () =>
        props.letters.map(i => {
          const style = emo.letter(props.fontSize, props.color);
          return <div className={style}>{i}</div>;
        }),
      [props.letters, props.fontSize, props.color],
    );
    return (
      <ElementRing
        nodes={circleLetter}
        angle={props.angle}
        offset={props.offset}
        radiusPx={props.radiusPx}
      />
    );
  },
);

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

export const SegmentedLetterCircle = (props: {
  readonly boxSizePx: number;
  readonly lineThicknessPx: number;
  readonly fontSize: number;
  readonly keys: string[];
  readonly innerRadiusRation: number;
  readonly outerRadiusRation: number;
  readonly angleOffsetMultiplier: number;
  readonly highlightedSegmentIndex: number | undefined;
  readonly letterColor: string;
}) => {
  const {
    boxSizePx,
    lineThicknessPx,
    fontSize,
    keys,
    innerRadiusRation,
    outerRadiusRation,
    angleOffsetMultiplier,
    highlightedSegmentIndex,
    letterColor,
  } = props;

  const segmentAngle = 360 / keys.length;
  const segmentOffset = segmentAngle * angleOffsetMultiplier;

  const halfLineThicknessPx = lineThicknessPx / 2;
  const actualBoxSizePx = boxSizePx + lineThicknessPx;
  const halfBoxSizePx = actualBoxSizePx / 2;
  const offsetPx = -halfBoxSizePx;

  const actualBorderThicknessRation = lineThicknessPx / actualBoxSizePx;

  const actualInnerRadiusRation =
    (innerRadiusRation * boxSizePx + halfLineThicknessPx) / actualBoxSizePx;
  const actualOuterRadiusRation =
    (outerRadiusRation * boxSizePx + halfLineThicknessPx) / actualBoxSizePx;

  const letterRadiusPx =
    ((innerRadiusRation + outerRadiusRation) / 2) * halfBoxSizePx;

  return (
    <>
      <RingSegments
        boxSizePx={actualBoxSizePx}
        offsetPx={offsetPx}
        borderThicknessRation={actualBorderThicknessRation}
        startRadiusRation={actualInnerRadiusRation}
        endRadiusRation={actualOuterRadiusRation}
        numSegments={keys.length}
        segmentAngle={segmentAngle}
        segmentOffset={segmentOffset}
        highlightedSegment={highlightedSegmentIndex}
      />
      <LetterRing
        letters={keys}
        angle={segmentAngle}
        offset={0}
        radiusPx={letterRadiusPx}
        fontSize={fontSize}
        color={letterColor}
      />
    </>
  );
};

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

  const isInTriggerZone = magnitudeSq > targetRadiusRationSq;
  const dotIndex = isInTriggerZone
    ? RadType.calcAngleIndex(xOrZero, yOrZero, segmentAngle, segmentOffset)
    : undefined;

  const isInTinyZone = magnitudeSq <= tinyRadiusRationSq;

  const actualX = (xOrZero * boxSizePx) / actualBoxSizePx;
  const actualY = (yOrZero * boxSizePx) / actualBoxSizePx;

  const lastDotIndex = React.useRef(dotIndex);
  React.useEffect(() => {
    if (dotIndex === undefined && lastDotIndex.current !== dotIndex) {
      const key = keys[(lastDotIndex.current + 1) % keys.length];
      appendLetter(key);
    }
    lastDotIndex.current = dotIndex;
  }, [dotIndex, keys, appendLetter]);

  const onAltButtonChanged = React.useCallback(
    () => (isInTinyZone ? appendLetter(centerKey) : {}),
    [appendLetter, centerKey, isInTinyZone],
  );
  RadType.useButtonEvents(
    gamepadId,
    altButtonId,
    undefined,
    onAltButtonChanged,
  );

  return (
    <div className={emo.radTypeContainerRelativeContainer(actualBoxSizePx)}>
      <div className={emo.radTypeContainerAbsoluteContainer(-offsetPx)}>
        <Circle
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          radiusRation={actualTinyRadiusRation}
          shouldHighlight={dotIndex === undefined && isInTinyZone}
        />

        <RingSegments
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          startRadiusRation={actualTargetRadiusRation}
          endRadiusRation={actualOuterRadiusRation}
          numSegments={keys.length}
          segmentAngle={segmentAngle}
          segmentOffset={segmentOffset}
          highlightedSegment={dotIndex}
        />

        <LetterRing
          letters={keys}
          angle={segmentAngle}
          offset={0}
          radiusPx={letterRadiusPx}
          fontSize={fontSize}
          color={"rgb(0, 0, 0)"}
        />

        <div className={emo.letter(fontSize, "rgb(0, 0, 0)")}>{centerKey}</div>

        <GamepadDot
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

export const RadTypeVis2 = (props: {
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
      appendLetter(key);
    }
    lastDefaultDotIndex.current = defaultDotIndex;
  }, [defaultDotIndex, defaultKeys, appendLetter, altButton]);

  const [enteredAltKey, setEnteredAltKey] = React.useState(false);

  const lastAltDotIndex = React.useRef(altDotIndex);
  React.useEffect(() => {
    if (
      altDotIndex === undefined &&
      lastAltDotIndex.current !== altDotIndex &&
      altButton
    ) {
      const key = altKeys[(lastAltDotIndex.current + 1) % altKeys.length];
      appendLetter(key);
      setEnteredAltKey(true);
    }
    lastAltDotIndex.current = altDotIndex;
  }, [altDotIndex, altKeys, appendLetter, altButton]);

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
    <div className={emo.radTypeContainerRelativeContainer(actualBoxSizePx)}>
      <div className={emo.radTypeContainerAbsoluteContainer(-offsetPx)}>
        <Circle
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          radiusRation={actualTinyRadiusRation}
          shouldHighlight={isInTinyZone}
        />
        {actualAltButton ? (
          <RingSegments
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
          <RingSegments
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

        <LetterRing
          letters={defaultKeys}
          angle={defaultSegmentAngle}
          offset={0}
          radiusPx={letterRadiusPx}
          fontSize={fontSize}
          color={defaultLetterColor}
        />

        <LetterRing
          letters={altKeys}
          angle={altSegmentAngle}
          offset={0}
          radiusPx={altLetterRadiusPx}
          fontSize={fontSize}
          color={altLetterColor}
        />

        <div
          className={emo.letter(
            fontSize,
            actualAltButton ? blackColor : greyColor,
          )}
        >
          {centerKey}
        </div>

        <GamepadDot
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

export const Home = () => {
  const lineThicknessPx = 5;
  const fontSize = 42;

  const bigCircleDiameterPx = 500;
  const targetCircleDiameterPx = 460;
  const letterCircleDiameterPx = 350;
  const altLetterCircleDiameterPx = 240;
  const tinyCircleDiameterPx = 100;

  const targetCircleRadiusRation = targetCircleDiameterPx / bigCircleDiameterPx;
  const letterCircleRadiusRation = letterCircleDiameterPx / bigCircleDiameterPx;
  const altLetterCircleRadiusRation =
    altLetterCircleDiameterPx / bigCircleDiameterPx;
  const tinyCircleRadiusRation = tinyCircleDiameterPx / bigCircleDiameterPx;

  const ringOffsetMultiplier = 1 / 2;

  const gamepadDotDiameterPx = 5;
  const gamepadDotRadiusRation = gamepadDotDiameterPx / bigCircleDiameterPx;
  const rowWidthPx = 1050;
  const rowHeightPx = 700;

  const [gamepadId, setGamepadId] = React.useState<number | undefined>();

  React.useEffect(() => {
    const eventListener = (e: Event) => {
      const eTyped = e as GamepadEvent;
      setGamepadId(eTyped.gamepad.index);
    };
    window.addEventListener("gamepadconnected", eventListener);
    return () => window.removeEventListener("gamepadconnected", eventListener);
  });

  React.useEffect(() => {
    const eventListener = (e: Event) => {
      const eTyped = e as GamepadEvent;
      setGamepadId(undefined);
    };
    window.addEventListener("gamepaddisconnected", eventListener);
    return () =>
      window.removeEventListener("gamepaddisconnected", eventListener);
  });

  const [text0, setText0] = React.useState("");
  const appendLetter0 = React.useCallback(
    (letter: string) => setText0(t => `${t}${letter}`),
    [setText0],
  );
  const backspace0 = React.useCallback(() => setText0(t => t.slice(0, -1)), [
    setText0,
  ]);
  const appendSpace0 = React.useCallback(() => appendLetter0(" "), [
    appendLetter0,
  ]);

  RadType.useButtonEvents(gamepadId, 2, undefined, backspace0);
  RadType.useButtonEvents(gamepadId, 3, undefined, appendSpace0);

  const [text1, setText1] = React.useState("");
  const appendLetter1 = React.useCallback(
    (letter: string) => setText1(t => `${t}${letter}`),
    [setText1],
  );
  const backspace1 = React.useCallback(() => setText1(t => t.slice(0, -1)), [
    setText1,
  ]);
  const appendSpace1 = React.useCallback(() => appendLetter1(" "), [
    appendLetter1,
  ]);

  RadType.useButtonEvents(gamepadId, 2, undefined, backspace1);
  RadType.useButtonEvents(gamepadId, 3, undefined, appendSpace1);

  return (
    <div className={emo.vertical()}>
      <div className={emo.rowWidthed(rowWidthPx, rowHeightPx)}>
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"E"}
          keys={["F", "V", "G", "R", "W", "Q", "A", "S", "Z", "X", "C", "D"]}
          targetCircleRadiusRation={targetCircleRadiusRation}
          letterCircleRadiusRation={letterCircleRadiusRation}
          tinyCircleRadiusRation={tinyCircleRadiusRation}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          angleOffsetMultiplier={ringOffsetMultiplier}
          gamepadId={gamepadId}
          xAxisId={0}
          yAxisId={1}
          altButtonId={4}
          appendLetter={appendLetter0}
        />
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"T"}
          keys={["L", "P", "O", "I", "U", "Y", "J", "H", "B", "N", "M", "K"]}
          targetCircleRadiusRation={targetCircleRadiusRation}
          letterCircleRadiusRation={letterCircleRadiusRation}
          tinyCircleRadiusRation={tinyCircleRadiusRation}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          angleOffsetMultiplier={ringOffsetMultiplier}
          gamepadId={gamepadId}
          xAxisId={2}
          yAxisId={3}
          altButtonId={5}
          appendLetter={appendLetter0}
        />
      </div>

      <div className={emo.row(rowHeightPx)}>
        <div className={emo.text(fontSize)}>{text0}</div>
      </div>

      <div className={emo.rowWidthed(rowWidthPx, rowHeightPx)}>
        <RadTypeVis2
          boxSizePx={bigCircleDiameterPx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"E"}
          defaultKeys={["F", "G", "R", "W", "A", "S", "D", "C"]}
          altKeys={["V", "Q", "Z", "X"]}
          targetCircleRadiusRation={targetCircleRadiusRation}
          letterCircleRadiusRation={letterCircleRadiusRation}
          altLetterCircleRadiusRation={altLetterCircleRadiusRation}
          tinyCircleRadiusRation={tinyCircleRadiusRation}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          gamepadId={gamepadId}
          xAxisId={0}
          yAxisId={1}
          altButtonId={4}
          appendLetter={appendLetter1}
        />
        <RadTypeVis2
          boxSizePx={bigCircleDiameterPx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"T"}
          defaultKeys={["O", "I", "U", "Y", "H", "N", "M", "L"]}
          altKeys={["P", "K", "J", "B"]}
          targetCircleRadiusRation={targetCircleRadiusRation}
          letterCircleRadiusRation={letterCircleRadiusRation}
          altLetterCircleRadiusRation={altLetterCircleRadiusRation}
          tinyCircleRadiusRation={tinyCircleRadiusRation}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          gamepadId={gamepadId}
          xAxisId={2}
          yAxisId={3}
          altButtonId={5}
          appendLetter={appendLetter1}
        />
      </div>

      <div className={emo.row(rowHeightPx)}>
        <div className={emo.text(fontSize)}>{text1}</div>
      </div>
    </div>
  );
};
