import * as React from "react";

import * as RadType from "rad-type";

export const RingSegments = React.memo(
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
      }) => (
        <RadType.RingSegment
          boxSizePx={boxSizePx}
          offsetPx={offsetPx}
          borderThicknessRation={borderThicknessRation}
          startRadiusRation={startRadiusRation}
          endRadiusRation={endRadiusRation}
          startLine={props.startLine}
          endLine={props.endLine}
          shouldHighlight={props.shouldHightlight}
        />
      ),
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
