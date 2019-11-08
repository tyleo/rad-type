import * as React from "react";

import * as RadType from "rad-type";

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
          const style = RadType.emo.letter(props.fontSize, props.color);
          return <div className={style}>{i}</div>;
        }),
      [props.letters, props.fontSize, props.color],
    );
    return (
      <RadType.ElementRing
        nodes={circleLetter}
        angle={props.angle}
        offset={props.offset}
        radiusPx={props.radiusPx}
      />
    );
  },
);
