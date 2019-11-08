import * as Emotion from "emotion";

export const emo = {
  letter: (fontSize: number, color: string) => Emotion.css`
    ${emo.text(fontSize)};
    color: ${color};
    display: flex;
    line-height: 0px;
    position: absolute;
    justify-content: center;
    width: 0px;
  `,

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

  text: (fontSize: number) => Emotion.css`
    font-family: "Arial Rounded MT Bold";
    font-size: ${fontSize}px;
  `,
} as const;
