import * as React from "react";

import * as Emotion from "emotion";

interface ILineData {
  readonly cos: number;
  readonly sin: number;
}

const atan2 = (x: number, y: number) => {
  const angle = Math.atan2(y, x);
  return angle < 0 ? angle + 2 * Math.PI : angle;
};

const calcAngleIndex = (
  x: number,
  y: number,
  angleIncrement: number,
  angleOffset: number,
) =>
  Math.floor(negToPosDeg(radToDeg(atan2(x, y)) - angleOffset) / angleIncrement);

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const negToPosDeg = (deg: number) => (deg < 0 ? deg + 360 : deg);

const radToDeg = (rad: number) => (rad * 180) / Math.PI;

const range = (first: number, count: number): number[] => {
  const result = [];
  for (let i = first; i < first + count; ++i) {
    result.push(i);
  }
  return result;
};

const useGamepad = (
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

const useJoystick = (
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

  useGamepad(gamepadId, onGamepad);

  return [x, y];
};

const useButton = (gamepadId: number | undefined, buttonId: number) => {
  const [state, setState] = React.useState<boolean | undefined>();

  const onGamepad = React.useCallback(
    (gamepad: Gamepad) => {
      const button = gamepad.buttons[buttonId];

      if (button.pressed !== state) setState(button.pressed);
    },
    [buttonId, state],
  );

  useGamepad(gamepadId, onGamepad);

  return state;
};

function useChangeEvent<T>(value: T, onChange: (prev: T, current: T) => void) {
  const lastValue = React.useRef(value);
  React.useEffect(() => {
    if (lastValue.current !== value) {
      onChange(lastValue.current, value);
    }
    lastValue.current = value;
  }, [value, onChange]);
}

const useButtonEvents = (
  gamepadId: number | undefined,
  buttonId: number,
  onPress?: () => void,
  onRelease?: () => void,
) => {
  const button = useButton(gamepadId, buttonId);
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
  useChangeEvent(button, onButtonChanged);
};

const useLogButtons = (gamepadId: number | undefined) => {
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

  useGamepad(gamepadId, onGamepad);
};

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
    position: absolute;
    line-height: 0px;
    justify-content: center;
    width: 0px;
  `,

  circleLetter: (
    angleDeg: number,
    radius: number,
    fontSize: number,
    color: string,
  ) => {
    const angleRad = degToRad(angleDeg);
    return Emotion.css`
      ${emo.letter(fontSize, color)};
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
    readonly startLine: ILineData;
    readonly endLine: ILineData;
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

    const lineData: readonly ILineData[] = React.useMemo(
      () =>
        range(0, numSegments).map(i => {
          const angle = degToRad(i * segmentAngle + segmentOffset);
          return {
            cos: Math.cos(angle),
            sin: Math.sin(angle),
          } as const;
        }),
      [numSegments, segmentAngle, segmentOffset],
    );

    const RingSegmentMemo = React.useCallback(
      (props: {
        readonly startLine: ILineData;
        readonly endLine: ILineData;
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
        {range(0, numSegments).map(i => (
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

export const LetterCircle = React.memo(
  (props: {
    readonly letters: string[];
    readonly angle: number;
    readonly offset: number;
    readonly radiusPx: number;
    readonly fontSize: number;
    readonly color: string;
  }) => {
    const circleLetter = React.useCallback(
      (letter: string, angle: number, color: string) => {
        const style = emo.circleLetter(
          angle,
          props.radiusPx,
          props.fontSize,
          color,
        );
        return (
          <div key={letter} className={style}>
            {letter}
          </div>
        );
      },
      [props.radiusPx, props.fontSize],
    );
    return (
      <>
        {props.letters.map((i, index) =>
          circleLetter(i, index * props.angle + props.offset, props.color),
        )}
      </>
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
      <LetterCircle
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
  readonly gamepadDotRadiusRation: number;
  readonly radiusRation: number;
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
    gamepadDotRadiusRation,
    radiusRation,
    angleOffsetMultiplier,
    gamepadId,
    xAxisId,
    yAxisId,
    altButtonId,
    appendLetter,
  } = props;
  const innerRadiusRationSq = radiusRation * radiusRation;
  const segmentAngle = 360 / keys.length;
  const segmentOffset = segmentAngle * angleOffsetMultiplier;

  const halfLineThicknessPx = lineThicknessPx / 2;
  const actualBoxSizePx = boxSizePx + lineThicknessPx;
  const offsetPx = -(actualBoxSizePx / 2);
  const actualBorderThicknessRation = lineThicknessPx / actualBoxSizePx;
  const actualGamepadDotRadiusRation =
    (gamepadDotRadiusRation * boxSizePx) / actualBoxSizePx;

  const actualInnerRadiusRation =
    (radiusRation * boxSizePx + halfLineThicknessPx) / actualBoxSizePx;

  const [x, y] = useJoystick(gamepadId, xAxisId, yAxisId);

  const xOrZero = x === undefined ? 0 : x;
  const yOrZero = y === undefined ? 0 : y;
  const magnitudeSq = xOrZero * xOrZero + yOrZero * yOrZero;

  const isInTriggerZone = magnitudeSq > innerRadiusRationSq;
  const dotIndex = isInTriggerZone
    ? calcAngleIndex(xOrZero, yOrZero, segmentAngle, segmentOffset)
    : undefined;

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

  const onAltButtonChanged = React.useCallback(() => appendLetter(centerKey), [
    appendLetter,
    centerKey,
  ]);
  useButtonEvents(gamepadId, altButtonId, undefined, onAltButtonChanged);

  return (
    <div className={emo.radTypeContainerRelativeContainer(actualBoxSizePx)}>
      <div className={emo.radTypeContainerAbsoluteContainer(-offsetPx)}>
        <Circle
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          radiusRation={actualInnerRadiusRation}
          shouldHighlight={dotIndex === undefined}
        />
        <SegmentedLetterCircle
          boxSizePx={boxSizePx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          keys={keys}
          innerRadiusRation={radiusRation}
          outerRadiusRation={1}
          angleOffsetMultiplier={angleOffsetMultiplier}
          highlightedSegmentIndex={dotIndex}
          letterColor={"rgb(0, 0, 0)"}
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
  readonly centerKey?: string;
  readonly innerKeys: string[];
  readonly outerKeys: string[];
  // ## Circles
  readonly gamepadDotRadiusRation: number;
  readonly innerRadiusRation: number;
  readonly outerRadiusRation: number;
  // # Behavior
  readonly gamepadId: number | undefined;
  readonly xAxisId: number;
  readonly yAxisId: number;
  readonly altButtonId: number;
}) => {
  const {
    boxSizePx,
    lineThicknessPx,
    fontSize,
    centerKey,
    innerKeys,
    outerKeys,
    gamepadDotRadiusRation,
    innerRadiusRation,
    outerRadiusRation,
    gamepadId,
    xAxisId,
    yAxisId,
    altButtonId,
  } = props;
  const outerRadiusRationSq = outerRadiusRation * outerRadiusRation;
  const outerSegmentAngle = 360 / outerKeys.length;
  const outerSegmentOffset = outerSegmentAngle * 0.5;

  const innerSegmentAngle = 360 / innerKeys.length;
  const innerSegmentOffset = innerSegmentAngle / 2;

  const halfLineThicknessPx = lineThicknessPx / 2;
  const actualBoxSizePx = boxSizePx + lineThicknessPx;
  const halfBoxSizePx = actualBoxSizePx / 2;
  const offsetPx = -halfBoxSizePx;
  const actualBorderThicknessRation = lineThicknessPx / actualBoxSizePx;
  const actualGamepadDotRadiusRation =
    (gamepadDotRadiusRation * boxSizePx) / actualBoxSizePx;

  const actualOuterRadiusRation =
    (outerRadiusRation * boxSizePx + halfLineThicknessPx) / actualBoxSizePx;
  const letterRadiusPx =
    ((innerRadiusRation + outerRadiusRation) / 2) * halfBoxSizePx;

  const [x, y] = useJoystick(gamepadId, xAxisId, yAxisId);
  const xOrZero = x === undefined ? 0 : x;
  const yOrZero = y === undefined ? 0 : y;
  const magnitudeSq = xOrZero * xOrZero + yOrZero * yOrZero;

  const altButton = useButton(gamepadId, altButtonId);
  const actualAltButton = altButton === undefined ? false : altButton;

  const blackColor = "rgb(0, 0, 0)";
  const greyColor = "rgb(179, 179, 179)";

  const innerDotIndex =
    actualAltButton && magnitudeSq > outerRadiusRationSq
      ? calcAngleIndex(xOrZero, yOrZero, innerSegmentAngle, innerSegmentOffset)
      : undefined;
  const outerDotIndex =
    !actualAltButton && magnitudeSq > outerRadiusRationSq
      ? calcAngleIndex(xOrZero, yOrZero, outerSegmentAngle, outerSegmentOffset)
      : undefined;
  const isCircleHighlighted =
    actualAltButton && magnitudeSq <= outerRadiusRationSq;

  const actualX = (xOrZero * boxSizePx) / actualBoxSizePx;
  const actualY = (yOrZero * boxSizePx) / actualBoxSizePx;

  return (
    <div className={emo.radTypeContainerRelativeContainer(actualBoxSizePx)}>
      <div className={emo.radTypeContainerAbsoluteContainer(-offsetPx)}>
        <Circle
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          radiusRation={actualOuterRadiusRation}
          shouldHighlight={isCircleHighlighted}
        />
        {actualAltButton ? (
          <>
            <LetterCircle
              letters={outerKeys}
              angle={outerSegmentAngle}
              offset={0}
              radiusPx={letterRadiusPx}
              fontSize={fontSize}
              color={greyColor}
            />
            <SegmentedLetterCircle
              boxSizePx={boxSizePx}
              lineThicknessPx={lineThicknessPx}
              fontSize={fontSize}
              keys={innerKeys}
              innerRadiusRation={outerRadiusRation}
              outerRadiusRation={1}
              angleOffsetMultiplier={0.5}
              highlightedSegmentIndex={innerDotIndex}
              letterColor={blackColor}
            />
          </>
        ) : (
          <>
            <LetterCircle
              letters={innerKeys}
              angle={innerSegmentAngle}
              offset={0}
              radiusPx={letterRadiusPx}
              fontSize={fontSize}
              color={greyColor}
            />
            <SegmentedLetterCircle
              boxSizePx={boxSizePx}
              lineThicknessPx={lineThicknessPx}
              fontSize={fontSize}
              keys={outerKeys}
              innerRadiusRation={outerRadiusRation}
              outerRadiusRation={1}
              angleOffsetMultiplier={0.5}
              highlightedSegmentIndex={outerDotIndex}
              letterColor={blackColor}
            />
          </>
        )}
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

  const midCircleDiameterPx = 390;

  const smallCircleDiameterPx = 280;

  const smallCircleRadiusRation = smallCircleDiameterPx / bigCircleDiameterPx;
  const midCircleRadiusRation = midCircleDiameterPx / bigCircleDiameterPx;

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

  useButtonEvents(gamepadId, 2, undefined, backspace0);
  useButtonEvents(gamepadId, 3, undefined, appendSpace0);

  return (
    <div className={emo.vertical()}>
      <div className={emo.rowWidthed(rowWidthPx, rowHeightPx)}>
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"E"}
          keys={["F", "V", "G", "R", "W", "Q", "A", "S", "Z", "X", "C", "D"]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          radiusRation={midCircleRadiusRation}
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
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          radiusRation={midCircleRadiusRation}
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
          innerKeys={["V", "Q", "Z", "X"]}
          outerKeys={["F", "G", "R", "W", "A", "S", "D", "C"]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          innerRadiusRation={smallCircleRadiusRation}
          outerRadiusRation={midCircleRadiusRation}
          gamepadId={gamepadId}
          xAxisId={0}
          yAxisId={1}
          altButtonId={4}
        />
        <RadTypeVis2
          boxSizePx={bigCircleDiameterPx}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"T"}
          innerKeys={["P", "K", "J", "B"]}
          outerKeys={["O", "I", "U", "Y", "H", "N", "M", "L"]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          innerRadiusRation={smallCircleRadiusRation}
          outerRadiusRation={midCircleRadiusRation}
          gamepadId={gamepadId}
          xAxisId={2}
          yAxisId={3}
          altButtonId={5}
        />
      </div>

      <div>{}</div>
    </div>
  );
};
