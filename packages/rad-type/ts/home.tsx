import * as React from "react";

import * as Emotion from "emotion";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const emo = {
  circle: (size: number, borderThickness: number) => Emotion.css`
    height: ${size}px;
    width: ${size}px;
    border: ${borderThickness}px solid black;
    border-radius: 50%;
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

  letter: (lineHeight: number) => Emotion.css`
    position: absolute;
    line-height: ${lineHeight}px;
    font-family: "Arial Rounded MT Bold";
  `,

  circleLetter: (angleDeg: number, radius: number, lineHeight: number) => {
    const angleRad = degToRad(angleDeg);
    return Emotion.css`
      ${emo.letter(lineHeight)};
      left: ${radius * Math.cos(angleRad)}px;
      bottom: ${radius * Math.sin(angleRad)}px;
    `;
  },

  centerLetter: (lineHeight: number) => Emotion.css`
    ${emo.letter(lineHeight)};
    top: -${lineHeight}px;
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

const Lines = React.memo(
  (props: {
    readonly bigCircleDiameter: number;
    readonly smallCircleDiameter: number;
    readonly borderThickness: number;
  }) => {
    const linesProps = props;

    const line00Angle = degToRad(15);
    const line01Angle = degToRad(45);
    const line02Angle = degToRad(75);
    const line03Angle = degToRad(105);
    const line04Angle = degToRad(135);
    const line05Angle = degToRad(165);
    const line06Angle = degToRad(195);
    const line07Angle = degToRad(225);
    const line08Angle = degToRad(255);
    const line09Angle = degToRad(285);
    const line10Angle = degToRad(315);
    const line11Angle = degToRad(345);

    const line00Cos = Math.cos(line00Angle);
    const line00Sin = Math.sin(line00Angle);
    const line01Cos = Math.cos(line01Angle);
    const line01Sin = Math.sin(line01Angle);
    const line02Cos = Math.cos(line02Angle);
    const line02Sin = Math.sin(line02Angle);
    const line03Cos = Math.cos(line03Angle);
    const line03Sin = Math.sin(line03Angle);
    const line04Cos = Math.cos(line04Angle);
    const line04Sin = Math.sin(line04Angle);
    const line05Cos = Math.cos(line05Angle);
    const line05Sin = Math.sin(line05Angle);
    const line06Cos = Math.cos(line06Angle);
    const line06Sin = Math.sin(line06Angle);
    const line07Cos = Math.cos(line07Angle);
    const line07Sin = Math.sin(line07Angle);
    const line08Cos = Math.cos(line08Angle);
    const line08Sin = Math.sin(line08Angle);
    const line09Cos = Math.cos(line09Angle);
    const line09Sin = Math.sin(line09Angle);
    const line10Cos = Math.cos(line10Angle);
    const line10Sin = Math.sin(line10Angle);
    const line11Cos = Math.cos(line11Angle);
    const line11Sin = Math.sin(line11Angle);

    const startMultiplier = props.smallCircleDiameter / props.bigCircleDiameter;

    const LineFromCosSin = (props: {
      readonly cos: number;
      readonly sin: number;
    }) => (
      <Line
        bigCircleDiameter={linesProps.bigCircleDiameter}
        borderThickness={linesProps.borderThickness}
        startX={startMultiplier * props.cos}
        startY={startMultiplier * props.sin}
        endX={props.cos}
        endY={props.sin}
      />
    );

    return (
      <>
        <LineFromCosSin cos={line00Cos} sin={line00Sin} />
        <LineFromCosSin cos={line01Cos} sin={line01Sin} />
        <LineFromCosSin cos={line02Cos} sin={line02Sin} />
        <LineFromCosSin cos={line03Cos} sin={line03Sin} />
        <LineFromCosSin cos={line04Cos} sin={line04Sin} />
        <LineFromCosSin cos={line05Cos} sin={line05Sin} />
        <LineFromCosSin cos={line06Cos} sin={line06Sin} />
        <LineFromCosSin cos={line07Cos} sin={line07Sin} />
        <LineFromCosSin cos={line08Cos} sin={line08Sin} />
        <LineFromCosSin cos={line09Cos} sin={line09Sin} />
        <LineFromCosSin cos={line10Cos} sin={line10Sin} />
        <LineFromCosSin cos={line11Cos} sin={line11Sin} />
      </>
    );
  },
);

export const GamepadDot = (props: {
  readonly bigCircleRadius: number;
  readonly x: number | undefined;
  readonly y: number | undefined;
  readonly circleBorderThickness: number;
}) => {
  const halfCircleBorderThickness = props.circleBorderThickness / 2;
  const actualX =
    (props.x === undefined ? 0 : props.x) * props.bigCircleRadius +
    halfCircleBorderThickness;
  const actualY =
    -(props.y === undefined ? 0 : props.y) * props.bigCircleRadius +
    halfCircleBorderThickness;

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
  const circleLetter = (angle: number) =>
    emo.circleLetter(angle, letterCircleRadius, lineHeight);

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
      if (gamepad.axes[1] !== leftY) setLeftY(gamepad.axes[1]);
      if (gamepad.axes[2] !== rightX) setRightX(gamepad.axes[2]);
      if (gamepad.axes[3] !== rightY) setRightY(gamepad.axes[3]);

      requestRef.current = requestAnimationFrame(updateGamepad);
    };

    requestRef.current = requestAnimationFrame(updateGamepad);

    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [leftX, leftY, rightX, rightY, gamepadId]);

  return (
    <div className={emo.horizontal()}>
      <div className={emo.circle(bigCircleDiameter, circleBorderSize)}>
        <div className={emo.circle(smallCircleDiameter, circleBorderSize)} />
        <div className={emo.letters(letterOffset)}>
          <div className={circleLetter(90)}>A</div>
          <div className={circleLetter(60)}>B</div>
          <div className={circleLetter(30)}>C</div>
          <div className={circleLetter(0)}>D</div>
          <div className={circleLetter(330)}>F</div>
          <div className={circleLetter(300)}>G</div>
          <div className={circleLetter(270)}>H</div>
          <div className={circleLetter(240)}>I</div>
          <div className={circleLetter(210)}>J</div>
          <div className={circleLetter(180)}>K</div>
          <div className={circleLetter(150)}>L</div>
          <div className={circleLetter(120)}>M</div>
          <div className={emo.centerLetter(lineHeight)}>E</div>
          <Lines
            bigCircleDiameter={bigCircleDiameter}
            smallCircleDiameter={smallCircleDiameter}
            borderThickness={circleBorderSize}
          />
          <GamepadDot
            x={leftX}
            y={leftY}
            bigCircleRadius={bigCircleRadius}
            circleBorderThickness={circleBorderSize}
          />
        </div>
      </div>
      <div className={emo.circle(bigCircleDiameter, circleBorderSize)}>
        <div className={emo.circle(smallCircleDiameter, circleBorderSize)} />
        <div className={emo.letters(letterOffset)}>
          <div className={circleLetter(90)}>N</div>
          <div className={circleLetter(60)}>O</div>
          <div className={circleLetter(30)}>P</div>
          <div className={circleLetter(0)}>Q</div>
          <div className={circleLetter(330)}>R</div>
          <div className={circleLetter(300)}>S</div>
          <div className={circleLetter(270)}>U</div>
          <div className={circleLetter(240)}>V</div>
          <div className={circleLetter(210)}>W</div>
          <div className={circleLetter(180)}>X</div>
          <div className={circleLetter(150)}>Y</div>
          <div className={circleLetter(120)}>Z</div>
          <div className={emo.centerLetter(lineHeight)}>T</div>
          <Lines
            bigCircleDiameter={bigCircleDiameter}
            smallCircleDiameter={smallCircleDiameter}
            borderThickness={circleBorderSize}
          />
          <GamepadDot
            x={rightX}
            y={rightY}
            bigCircleRadius={bigCircleRadius}
            circleBorderThickness={circleBorderSize}
          />
        </div>
      </div>
    </div>
  );
};
