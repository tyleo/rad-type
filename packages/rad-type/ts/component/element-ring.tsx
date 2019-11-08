import * as React from "react";

import * as Emotion from "emotion";

import * as RadType from "rad-type";

const emo = {
  circleItem: (angleDeg: number, radius: number) => {
    const angleRad = RadType.degToRad(angleDeg);
    return Emotion.css`
      position: absolute;
      left: ${radius * Math.cos(angleRad)}px;
      bottom: ${radius * Math.sin(angleRad)}px;
    `;
  },
} as const;

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
