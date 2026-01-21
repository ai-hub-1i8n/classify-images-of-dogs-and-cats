export const CANVAS_SIZE = 600;
export const facingMode = "user";
export const constraints = {
  audio: false,
  video: {
    facingMode: facingMode,
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
};
