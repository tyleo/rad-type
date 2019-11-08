import * as React from "react";

export const useChangeEvent = <T>(
  value: T,
  onChange: (prev: T, current: T) => void,
) => {
  const lastValue = React.useRef(value);
  React.useEffect(() => {
    if (lastValue.current !== value) {
      onChange(lastValue.current, value);
    }
    lastValue.current = value;
  }, [value, onChange]);
};
