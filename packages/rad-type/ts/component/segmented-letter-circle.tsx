import * as React from "react";

import * as RadType from "rad-type";

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
      <RadType.RingSegments
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
      <RadType.LetterRing
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
