/** False on browsers or devices where WebGL is off, so the 3D scenes can fall back to HTML. */
export const hasWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};
