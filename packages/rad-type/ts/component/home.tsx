import * as React from "react";

import * as Emotion from "emotion";

import * as RadType from "rad-type";

const emo = {
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

  vertical: () => Emotion.css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
  `,
} as const;

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
        <RadType.RadTypeVis
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
        <RadType.RadTypeVis
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
        <div className={RadType.emo.text(fontSize)}>{text0}</div>
      </div>

      <div className={emo.rowWidthed(rowWidthPx, rowHeightPx)}>
        <RadType.RadTypeVisEx
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
        <RadType.RadTypeVisEx
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
        <div className={RadType.emo.text(fontSize)}>{text1}</div>
      </div>
    </div>
  );
};
