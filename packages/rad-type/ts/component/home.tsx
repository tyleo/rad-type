import * as React from "react";

import * as Emotion from "emotion";

import * as RadType from "rad-type";

const emo = {
  button: (fontSize: number) => Emotion.css`
    ${RadType.emo.text(fontSize)};
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 5px;
    margin-right: 5px;
  `,

  row: (paddingPx: number) => Emotion.css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: ${paddingPx}px;
    padding-bottom: ${paddingPx}px;
  `,
  rowHeighted: (heightPx: number, paddingPx: number) => Emotion.css`
    ${emo.row(heightPx)};
    height: ${heightPx}px;
  `,

  rowWidthed: (widthPx: number, paddingPx: number) => Emotion.css`
    ${emo.row(paddingPx)};
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
  const rowHeightPx = 100;
  const rowPaddingPx = 50;

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

  const [text, setText] = React.useState("");
  const appendLetter = React.useCallback(
    (letter: string) => setText(t => `${t}${letter}`),
    [setText],
  );
  const backspace = React.useCallback(() => setText(t => t.slice(0, -1)), [
    setText,
  ]);
  const appendSpace = React.useCallback(() => appendLetter(" "), [
    appendLetter,
  ]);

  RadType.useButtonEvents(gamepadId, 2, undefined, backspace);
  RadType.useButtonEvents(gamepadId, 3, undefined, appendSpace);

  const [visualizationId, setVisualizationId] = React.useState(0);
  const toggleVisualizationId = React.useCallback(
    () =>
      setVisualizationId(visualizationId => (visualizationId === 0 ? 1 : 0)),
    [],
  );

  const clearText = React.useCallback(() => setText(""), []);

  const visualization = React.useMemo(
    () =>
      visualizationId === 0 ? (
        <>
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
            appendLetter={appendLetter}
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
            appendLetter={appendLetter}
          />
        </>
      ) : (
        <>
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
            appendLetter={appendLetter}
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
            appendLetter={appendLetter}
          />
        </>
      ),
    [
      altLetterCircleRadiusRation,
      appendLetter,
      gamepadDotRadiusRation,
      gamepadId,
      letterCircleRadiusRation,
      ringOffsetMultiplier,
      targetCircleRadiusRation,
      tinyCircleRadiusRation,
      visualizationId,
    ],
  );

  return (
    <div className={emo.vertical()}>
      <div className={emo.rowWidthed(rowWidthPx, rowPaddingPx)}>
        {visualization}
      </div>

      <div className={emo.rowHeighted(rowHeightPx, rowPaddingPx)}>
        <div className={RadType.emo.text(fontSize)}>{text}</div>
      </div>

      <div className={emo.row(rowPaddingPx)}>
        <button
          className={emo.button(fontSize)}
          onClick={toggleVisualizationId}
        >
          Toggle Visualization
        </button>
        <button className={emo.button(fontSize)} onClick={clearText}>
          Clear Text
        </button>
      </div>
    </div>
  );
};