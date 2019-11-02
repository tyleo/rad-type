import * as React from "react";

import * as Emotion from "emotion";

interface ILineData {
  readonly cos: number;
  readonly sin: number;
}

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const radToDeg = (rad: number) => (rad * 180) / Math.PI;

const range = (first: number, count: number): number[] => {
  const result = [];
  for (let i = first; i < first + count; ++i) {
    result.push(i);
  }
  return result;
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

  row: (widthPx: number, heightPx: number) => Emotion.css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: ${widthPx}px;
    height: ${heightPx}px;
  `,

  letter: (fontSize: number) => Emotion.css`
    position: absolute;
    display: flex;
    line-height: 0px;
    justify-content: center;
    font-family: "Arial Rounded MT Bold";
    font-size: ${fontSize}px;
    width: 0px;
  `,

  circleLetter: (angleDeg: number, radius: number, fontSize: number) => {
    const angleRad = degToRad(angleDeg);
    return Emotion.css`
      ${emo.letter(fontSize)};
      left: ${radius * Math.cos(angleRad)}px;
      bottom: ${radius * Math.sin(angleRad)}px;
    `;
  },

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
    readonly radiusPx: number;
    readonly fontSize: number;
  }) => {
    const circleLetter = React.useCallback(
      (letter: string, angle: number) => {
        const style = emo.circleLetter(angle, props.radiusPx, props.fontSize);
        return <div className={style}>{letter}</div>;
      },
      [props.radiusPx, props.fontSize],
    );
    return (
      <>
        {props.letters.map((i, index) => circleLetter(i, index * props.angle))}
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

export const RadTypeVis = (props: {
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
  readonly midRadiusRation: number;
  readonly innerRingOffsetMultiplier: number;
  readonly outerRingOffsetMultiplier: number;
  // # Behavior
  readonly gamepadId: number | undefined;
  readonly xAxisId: number;
  readonly yAxisId: number;
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
    midRadiusRation,
    innerRingOffsetMultiplier,
    outerRingOffsetMultiplier,
    gamepadId,
    xAxisId,
    yAxisId,
  } = props;
  const midRadiusRationSq = midRadiusRation * midRadiusRation;
  const outerSegmentAngle = 360 / outerKeys.length;
  const outerSegmentOffset = outerSegmentAngle * outerRingOffsetMultiplier;

  const innerRadiusRationSq = innerRadiusRation * innerRadiusRation;
  const innerSegmentAngle = 360 / innerKeys.length;
  const innerSegmentOffset = innerSegmentAngle * innerRingOffsetMultiplier;

  const halfLineThicknessPx = lineThicknessPx / 2;
  const actualBoxSizePx = boxSizePx + lineThicknessPx;
  const offsetPx = -(actualBoxSizePx / 2);
  const actualBorderThicknessRation = lineThicknessPx / actualBoxSizePx;
  const actualGamepadDotRadiusRation =
    (gamepadDotRadiusRation * boxSizePx) / actualBoxSizePx;

  const actualInnerRadiusRation =
    (innerRadiusRation * boxSizePx + halfLineThicknessPx) / actualBoxSizePx;
  const actualMidRadiusRation =
    (midRadiusRation * boxSizePx + halfLineThicknessPx) / actualBoxSizePx;
  const actualOuterRadiusRation =
    (boxSizePx + halfLineThicknessPx) / actualBoxSizePx;

  const innerLetterRadiusPx =
    (actualInnerRadiusRation + (midRadiusRation - innerRadiusRation) / 2) *
    (actualBoxSizePx / 2);
  const outerLetterRadiusPx =
    (midRadiusRation + (1 - midRadiusRation) / 2) * (actualBoxSizePx / 2);

  const [x, setX] = React.useState<number | undefined>();
  const [y, setY] = React.useState<number | undefined>();
  const animationFrameRef = React.useRef<number | undefined>();

  React.useEffect(() => {
    if (gamepadId === undefined) return;

    const updateGamepad = () => {
      const gamepad = navigator.getGamepads()[gamepadId];
      if (gamepad === null) return;

      const xAxis = gamepad.axes[xAxisId];
      const yAxis = -gamepad.axes[yAxisId];

      if (xAxis !== x) setX(xAxis);
      if (yAxis !== y) setY(yAxis);

      animationFrameRef.current = requestAnimationFrame(updateGamepad);
    };

    animationFrameRef.current = requestAnimationFrame(updateGamepad);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gamepadId, xAxisId, yAxisId, x, y]);

  let angle =
    x === undefined || y === undefined ? 0 : radToDeg(Math.atan2(y, x));
  angle = angle < 0 ? angle + 360 : angle;

  const xOrZero = x === undefined ? 0 : x;
  const yOrZero = y === undefined ? 0 : y;
  const magnitudeSq = xOrZero * xOrZero + yOrZero * yOrZero;

  let outerDotIndex = undefined;
  if (midRadiusRationSq <= magnitudeSq) {
    outerDotIndex = 0;
    let currentAngle = outerSegmentOffset;

    while (
      currentAngle < 360 - outerSegmentOffset &&
      !(currentAngle <= angle && angle < currentAngle + outerSegmentAngle)
    ) {
      currentAngle += outerSegmentAngle;
      ++outerDotIndex;
    }
  }

  let innerDotIndex: number | undefined = undefined;
  if (innerRadiusRationSq !== undefined && innerRadiusRationSq <= magnitudeSq) {
    innerDotIndex = 0;
    let currentAngle = innerSegmentOffset;

    while (
      currentAngle < 360 - innerSegmentOffset &&
      !(currentAngle <= angle && angle < currentAngle + innerSegmentAngle)
    ) {
      currentAngle += innerSegmentAngle;
      ++innerDotIndex;
    }
  }

  const InnerRing = React.memo(
    React.useCallback(
      (props: { readonly dotIndex: number | undefined }) => (
        <>
          <RingSegments
            boxSizePx={actualBoxSizePx}
            offsetPx={offsetPx}
            borderThicknessRation={actualBorderThicknessRation}
            startRadiusRation={actualInnerRadiusRation}
            endRadiusRation={actualMidRadiusRation}
            numSegments={innerKeys.length}
            segmentAngle={innerSegmentAngle}
            segmentOffset={innerSegmentOffset}
            highlightedSegment={props.dotIndex}
          />
          <LetterCircle
            letters={innerKeys}
            angle={innerSegmentAngle}
            radiusPx={innerLetterRadiusPx}
            fontSize={fontSize}
          />
        </>
      ),
      [
        actualBoxSizePx,
        offsetPx,
        actualBorderThicknessRation,
        actualInnerRadiusRation,
        actualMidRadiusRation,
        innerKeys,
        innerSegmentAngle,
        innerSegmentOffset,
        innerLetterRadiusPx,
        fontSize,
      ],
    ),
  );

  const actualX = (xOrZero * boxSizePx) / actualBoxSizePx;
  const actualY = (yOrZero * boxSizePx) / actualBoxSizePx;

  return (
    <div className={emo.radTypeContainerRelativeContainer(actualBoxSizePx)}>
      <div className={emo.radTypeContainerAbsoluteContainer(-offsetPx)}>
        <Circle
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          radiusRation={actualInnerRadiusRation}
          shouldHighlight={outerDotIndex === undefined}
        />
        <RingSegments
          boxSizePx={actualBoxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={actualBorderThicknessRation}
          startRadiusRation={actualMidRadiusRation}
          endRadiusRation={actualOuterRadiusRation}
          numSegments={outerKeys.length}
          segmentAngle={outerSegmentAngle}
          segmentOffset={outerSegmentOffset}
          highlightedSegment={outerDotIndex}
        />
        <LetterCircle
          letters={outerKeys}
          angle={outerSegmentAngle}
          radiusPx={outerLetterRadiusPx}
          fontSize={fontSize}
        />
        <div className={emo.letter(fontSize)}>{centerKey}</div>
        <InnerRing dotIndex={innerDotIndex} />
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

  const bigCircleDiameterPx1 = 500;
  const midCircleDiameterPx1 = 375;

  const midCircleDiameterPx2 = 350;
  const smallCircleDiameterPx = 200;

  const midCircleRadiusRation1 = midCircleDiameterPx1 / bigCircleDiameterPx1;
  const midCircleRadiusRation2 = midCircleDiameterPx2 / bigCircleDiameterPx1;

  const ringOffsetMultiplier = 1 / 2;

  const smallCircleRadiusRation = smallCircleDiameterPx / bigCircleDiameterPx1;
  const gamepadDotDiameterPx = 5;
  const gamepadDotRadiusRation = gamepadDotDiameterPx / bigCircleDiameterPx1;
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

  return (
    <div className={emo.vertical()}>
      <div className={emo.row(rowWidthPx, rowHeightPx)}>
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx1}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"E"}
          innerKeys={[]}
          outerKeys={[
            "F",
            "V",
            "G",
            "R",
            "W",
            "Q",
            "A",
            "S",
            "Z",
            "X",
            "C",
            "D",
          ]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          innerRadiusRation={midCircleRadiusRation1}
          midRadiusRation={midCircleRadiusRation1}
          innerRingOffsetMultiplier={ringOffsetMultiplier}
          outerRingOffsetMultiplier={ringOffsetMultiplier}
          gamepadId={gamepadId}
          xAxisId={0}
          yAxisId={1}
        />
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx1}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"T"}
          innerKeys={[]}
          outerKeys={[
            "L",
            "P",
            "O",
            "I",
            "U",
            "Y",
            "J",
            "H",
            "B",
            "N",
            "M",
            "K",
          ]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          innerRadiusRation={midCircleRadiusRation1}
          midRadiusRation={midCircleRadiusRation1}
          innerRingOffsetMultiplier={ringOffsetMultiplier}
          outerRingOffsetMultiplier={ringOffsetMultiplier}
          gamepadId={gamepadId}
          xAxisId={2}
          yAxisId={3}
        />
      </div>

      <div className={emo.row(rowWidthPx, rowHeightPx)}>
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx1}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"E"}
          outerKeys={["V", "Q", "Z", "X"]}
          innerKeys={["F", "R", "W", "G", "A", "S", "D", "C"]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          innerRadiusRation={smallCircleRadiusRation}
          midRadiusRation={midCircleRadiusRation2}
          innerRingOffsetMultiplier={ringOffsetMultiplier}
          outerRingOffsetMultiplier={ringOffsetMultiplier}
          gamepadId={gamepadId}
          xAxisId={0}
          yAxisId={1}
        />
        <RadTypeVis
          boxSizePx={bigCircleDiameterPx1}
          lineThicknessPx={lineThicknessPx}
          fontSize={fontSize}
          centerKey={"T"}
          outerKeys={["P", "K", "J", "B"]}
          innerKeys={["O", "I", "U", "Y", "H", "N", "M", "L"]}
          gamepadDotRadiusRation={gamepadDotRadiusRation}
          innerRadiusRation={smallCircleRadiusRation}
          midRadiusRation={midCircleRadiusRation2}
          innerRingOffsetMultiplier={ringOffsetMultiplier}
          outerRingOffsetMultiplier={ringOffsetMultiplier}
          gamepadId={gamepadId}
          xAxisId={2}
          yAxisId={3}
        />
      </div>
    </div>
  );
};
