import * as React from "react";

import * as Emotion from "emotion";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const emo = {
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

  letters: (offset: number) => Emotion.css`
    position: absolute;
    left: ${offset}px;
    bottom: ${offset}px;
    display: block;
  `,

  horizontal: () => Emotion.css`
    display: flex;
    flex-direction-row;
    width: 100%;
    height: 100%;
    justify-content: space-around;
    align-items: center;
  `,

  letter: (lineHeight: number, fontSize: number) => Emotion.css`
    position: absolute;
    line-height: ${lineHeight}px;
    font-family: "Arial Rounded MT Bold";
    font-size: ${fontSize}px;
  `,

  circleLetter: (
    angleDeg: number,
    radius: number,
    lineHeight: number,
    fontSize: number,
    fontSizeDivisor: number,
  ) => {
    const angleRad = degToRad(angleDeg);
    return Emotion.css`
      ${emo.letter(lineHeight, fontSize)};
      left: ${radius * Math.cos(angleRad) - fontSize / fontSizeDivisor}px;
      bottom: ${radius * Math.sin(angleRad)}px;
    `;
  },

  centerLetter: (
    lineHeight: number,
    fontSize: number,
    fontSizeDivisor: number,
  ) => Emotion.css`
    ${emo.letter(lineHeight, fontSize)};
    top: -${lineHeight}px;
    left: ${-fontSize / fontSizeDivisor}px
  `,
} as const;

const Line = (props: {
  readonly bigCircleDiameter: number;
  readonly borderThickness: number;
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}) => {
  const bigCircleRadius = props.bigCircleDiameter / 2;
  const [svgStyle, lineStyle] = React.useMemo(
    () =>
      [
        {
          position: "absolute",
          left: -(bigCircleRadius - props.borderThickness),
          bottom: -(bigCircleRadius - props.borderThickness),
        } as const,
        {
          stroke: "rgb(0,0,0)",
          strokeWidth: props.borderThickness / bigCircleRadius,
        },
      ] as const,
    [bigCircleRadius, props.borderThickness],
  );
  return (
    <svg
      height={props.bigCircleDiameter}
      width={props.bigCircleDiameter}
      viewBox="-1,-1,2,2"
      transform="scale(1, -1)"
      style={svgStyle}
    >
      <line
        x1={props.startX}
        y1={props.startY}
        x2={props.endX}
        y2={props.endY}
        style={lineStyle}
      />
    </svg>
  );
};

interface ILineData {
  readonly cos: number;
  readonly sin: number;
}

const RingSegment = (props: {
  readonly boxSize: number;
  readonly borderThickness: number;
  readonly startRadius: number;
  readonly endRadius: number;
  readonly startLine: ILineData;
  readonly endLine: ILineData;
}) => {
  const [svgStyle, data] = React.useMemo(() => {
    const offset = -(props.boxSize / 2);
    const scaledBorderThickness = (props.borderThickness * 2) / props.boxSize;
    const startRadius = props.startRadius - scaledBorderThickness;
    const endRadius = props.endRadius - scaledBorderThickness;
    const innerStart = {
      X: props.startLine.cos * startRadius,
      Y: props.startLine.sin * startRadius,
    } as const;
    const outerStart = {
      X: props.startLine.cos * endRadius,
      Y: props.startLine.sin * endRadius,
    } as const;
    const outerEnd = {
      X: props.endLine.cos * endRadius,
      Y: props.endLine.sin * endRadius,
    } as const;
    const innerEnd = {
      X: props.endLine.cos * startRadius,
      Y: props.endLine.sin * startRadius,
    } as const;

    const data =
      `M ${innerStart.X} ${innerStart.Y}` +
      `L ${outerStart.X} ${outerStart.Y}` +
      `A ${props.endRadius} ${props.endRadius} 0 0 1 ${outerEnd.X} ${outerEnd.Y}` +
      `L ${innerEnd.X} ${innerEnd.Y}` +
      `A ${props.startRadius} ${props.startRadius} 0 0 0 ${innerStart.X} ${innerStart.Y}` +
      `Z`;

    return [
      {
        position: "absolute",
        fill: "rgba(255, 255, 255, 0)",
        left: offset,
        bottom: offset,
        stroke: "rgb(0,0,0)",
        strokeWidth: scaledBorderThickness,
      } as const,
      data,
    ];
  }, [
    props.boxSize,
    props.borderThickness,
    props.startRadius,
    props.endRadius,
    props.startLine,
    props.endLine,
  ]);

  return (
    <svg
      height={props.boxSize + props.borderThickness * 2}
      width={props.boxSize + props.borderThickness * 2}
      viewBox="-1,-1,2,2"
      transform="scale(1, -1)"
      style={svgStyle}
    >
      <path d={data} />
    </svg>
  );
};

const range = (first: number, count: number): number[] => {
  const result = [];
  for (let i = first; i < first + count; ++i) {
    result.push(i);
  }
  return result;
};

const RingSegments = (props: {
  readonly bigCircleDiameter: number;
  readonly smallCircleDiameter: number;
  readonly borderThickness: number;
}) => {
  const outerProps = props;

  const lineData: readonly ILineData[] = React.useMemo(
    () =>
      range(0, 12).map(i => {
        const angle = degToRad(i * 30 + 15);
        return {
          cos: Math.cos(angle),
          sin: Math.sin(angle),
        } as const;
      }),
    [],
  );

  const startRadius =
    outerProps.smallCircleDiameter / outerProps.bigCircleDiameter;
  const RingSegmentMemo = React.useMemo(
    () => (props: {
      readonly startLine: ILineData;
      readonly endLine: ILineData;
    }) => {
      return (
        <RingSegment
          boxSize={outerProps.bigCircleDiameter}
          borderThickness={outerProps.borderThickness}
          startRadius={startRadius}
          endRadius={1}
          startLine={props.startLine}
          endLine={props.endLine}
        />
      );
    },
    [outerProps.bigCircleDiameter, outerProps.borderThickness, startRadius],
  );

  return (
    <>
      <RingSegmentMemo startLine={lineData[0]} endLine={lineData[1]} />
      <RingSegmentMemo startLine={lineData[1]} endLine={lineData[2]} />
      <RingSegmentMemo startLine={lineData[2]} endLine={lineData[3]} />
      <RingSegmentMemo startLine={lineData[3]} endLine={lineData[4]} />
      <RingSegmentMemo startLine={lineData[4]} endLine={lineData[5]} />
      <RingSegmentMemo startLine={lineData[5]} endLine={lineData[6]} />
      <RingSegmentMemo startLine={lineData[6]} endLine={lineData[7]} />
      <RingSegmentMemo startLine={lineData[7]} endLine={lineData[8]} />
      <RingSegmentMemo startLine={lineData[8]} endLine={lineData[9]} />
      <RingSegmentMemo startLine={lineData[9]} endLine={lineData[10]} />
      <RingSegmentMemo startLine={lineData[10]} endLine={lineData[11]} />
      <RingSegmentMemo startLine={lineData[11]} endLine={lineData[0]} />
    </>
  );
};

const Lines = (props: {
  readonly bigCircleDiameter: number;
  readonly smallCircleDiameter: number;
  readonly borderThickness: number;
}) => {
  const linesProps = props;

  const lineData = React.useMemo(
    () =>
      range(0, 12).map(i => {
        const angle = degToRad(i * 30 + 15);
        return {
          angle,
          cos: Math.cos(angle),
          sin: Math.sin(angle),
        };
      }),
    [],
  );

  const startMultiplier =
    linesProps.smallCircleDiameter / linesProps.bigCircleDiameter;
  const LineFromCosSin = React.useMemo(
    () => (props: {
      readonly lineData: {
        readonly angle: number;
        readonly cos: number;
        readonly sin: number;
      };
    }) => {
      const { cos, sin } = props.lineData;

      return (
        <Line
          bigCircleDiameter={linesProps.bigCircleDiameter}
          borderThickness={linesProps.borderThickness}
          startX={startMultiplier * cos}
          startY={startMultiplier * sin}
          endX={cos}
          endY={sin}
        />
      );
    },
    [startMultiplier, linesProps.bigCircleDiameter, linesProps.borderThickness],
  );

  return (
    <>
      <LineFromCosSin lineData={lineData[0]} />
      <LineFromCosSin lineData={lineData[1]} />
      <LineFromCosSin lineData={lineData[2]} />
      <LineFromCosSin lineData={lineData[3]} />
      <LineFromCosSin lineData={lineData[4]} />
      <LineFromCosSin lineData={lineData[5]} />
      <LineFromCosSin lineData={lineData[6]} />
      <LineFromCosSin lineData={lineData[7]} />
      <LineFromCosSin lineData={lineData[8]} />
      <LineFromCosSin lineData={lineData[9]} />
      <LineFromCosSin lineData={lineData[10]} />
      <LineFromCosSin lineData={lineData[11]} />
    </>
  );
};

export const GamepadDot = (props: {
  readonly bigCircleRadius: number;
  readonly x: number | undefined;
  readonly y: number | undefined;
}) => {
  const actualX = (props.x === undefined ? 0 : props.x) * props.bigCircleRadius;
  const actualY = (props.y === undefined ? 0 : props.y) * props.bigCircleRadius;

  const size = "5px";

  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        width: size,
        height: size,
        background: "black",
        left: `${actualX}px`,
        bottom: `${actualY}px`,
      }}
    />
  );
};

export const Home = () => {
  const circleBorderSize = 5;
  const bigCircleDiameter = 500;
  const bigCircleRadius = bigCircleDiameter / 2;
  const smallCircleDiameter = 300;
  const smallCircleRadius = smallCircleDiameter / 2;
  const letterOffset = bigCircleRadius - circleBorderSize;
  const letterCircleRadius = (bigCircleRadius + smallCircleRadius) / 2;
  const lineHeight = 10;
  const fontSize = 42;
  const fontSizeDivisor = 6;
  const circleLetter = (angle: number) =>
    emo.circleLetter(
      angle,
      letterCircleRadius,
      lineHeight,
      fontSize,
      fontSizeDivisor,
    );

  const [gamepadId, setGamepadId] = React.useState<number | undefined>();

  const [leftX, setLeftX] = React.useState<number | undefined>();
  const [leftY, setLeftY] = React.useState<number | undefined>();
  const [rightX, setRightX] = React.useState<number | undefined>();
  const [rightY, setRightY] = React.useState<number | undefined>();

  React.useEffect(() => {
    const eventListener = (e: Event) => {
      const eTyped = e as GamepadEvent;
      setGamepadId(eTyped.gamepad.index);
    };
    window.addEventListener("gamepadconnected", eventListener);
    return () => window.removeEventListener("gamepadconnected", eventListener);
  });

  const requestRef = React.useRef<number | undefined>();

  React.useEffect(() => {
    if (gamepadId === undefined) return;

    const updateGamepad = () => {
      const gamepad = navigator.getGamepads()[gamepadId];
      if (gamepad === null) return;
      if (gamepad.axes[0] !== leftX) setLeftX(gamepad.axes[0]);
      if (-gamepad.axes[1] !== leftY) setLeftY(-gamepad.axes[1]);
      if (gamepad.axes[2] !== rightX) setRightX(gamepad.axes[2]);
      if (-gamepad.axes[3] !== rightY) setRightY(-gamepad.axes[3]);

      requestRef.current = requestAnimationFrame(updateGamepad);
    };

    requestRef.current = requestAnimationFrame(updateGamepad);

    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [leftX, leftY, rightX, rightY, gamepadId]);

  // const leftAngle =
  //   leftY === undefined || leftX === undefined ? 0 : Math.atan2(leftY, leftX);
  // const leftXOrZero = leftX === undefined ? 0 : leftX;
  // const leftYOrZero = leftY === undefined ? 0 : leftY;
  // const leftMagnitudeSq = leftYOrZero * leftYOrZero + leftXOrZero * leftXOrZero;

  // const rightAngle =
  //   leftY === undefined || leftX === undefined ? 0 : Math.atan2(leftY, leftX);
  // const rightXOrZero = rightX === undefined ? 0 : rightX;
  // const rightYOrZero = rightY === undefined ? 0 : rightY;
  // const rightMagnitudeSq =
  //   rightYOrZero * rightYOrZero + rightXOrZero * rightXOrZero;

  return (
    <div className={emo.horizontal()}>
      <div className={emo.circle(bigCircleDiameter)}>
        <div className={emo.circle(smallCircleDiameter)} />
        <div className={emo.letters(letterOffset)}>
          <div className={circleLetter(90)}>R</div>
          <div className={circleLetter(60)}>G</div>
          <div className={circleLetter(30)}>V</div>
          <div className={circleLetter(0)}>F</div>
          <div className={circleLetter(330)}>D</div>
          <div className={circleLetter(300)}>C</div>
          <div className={circleLetter(270)}>X</div>
          <div className={circleLetter(240)}>Z</div>
          <div className={circleLetter(210)}>S</div>
          <div className={circleLetter(180)}>A</div>
          <div className={circleLetter(150)}>Q</div>
          <div className={circleLetter(120)}>W</div>
          <div
            className={emo.centerLetter(lineHeight, fontSize, fontSizeDivisor)}
          >
            E
          </div>
          {/* <Lines
            bigCircleDiameter={bigCircleDiameter}
            smallCircleDiameter={smallCircleDiameter}
            borderThickness={circleBorderSize}
          /> */}
          <RingSegments
            bigCircleDiameter={bigCircleDiameter}
            smallCircleDiameter={smallCircleDiameter}
            borderThickness={circleBorderSize}
          />
          <GamepadDot x={leftX} y={leftY} bigCircleRadius={bigCircleRadius} />
        </div>
      </div>
      <div className={emo.circle(bigCircleDiameter)}>
        <div className={emo.circle(smallCircleDiameter)} />
        <div className={emo.letters(letterOffset)}>
          <div className={circleLetter(90)}>I</div>
          <div className={circleLetter(60)}>O</div>
          <div className={circleLetter(30)}>P</div>
          <div className={circleLetter(0)}>L</div>
          <div className={circleLetter(330)}>K</div>
          <div className={circleLetter(300)}>M</div>
          <div className={circleLetter(270)}>N</div>
          <div className={circleLetter(240)}>B</div>
          <div className={circleLetter(210)}>H</div>
          <div className={circleLetter(180)}>J</div>
          <div className={circleLetter(150)}>Y</div>
          <div className={circleLetter(120)}>U</div>
          <div
            className={emo.centerLetter(lineHeight, fontSize, fontSizeDivisor)}
          >
            T
          </div>
          {/* <Lines
            bigCircleDiameter={bigCircleDiameter}
            smallCircleDiameter={smallCircleDiameter}
            borderThickness={circleBorderSize}
          /> */}
          <RingSegments
            bigCircleDiameter={bigCircleDiameter}
            smallCircleDiameter={smallCircleDiameter}
            borderThickness={circleBorderSize}
          />
          <GamepadDot x={rightX} y={rightY} bigCircleRadius={bigCircleRadius} />
        </div>
      </div>
    </div>
  );
};
