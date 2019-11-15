export interface IVibrationActuator {
  readonly playEffect: (
    type: "vibration" | "dual-rumble",
    params: {
      readonly duration: number;
      readonly startDelay?: number;
      readonly strongMagnitude?: number;
      readonly weakMagnitude?: number;
    },
  ) => Promise<void>;
}
