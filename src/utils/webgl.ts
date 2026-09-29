/** False on browsers or devices where WebGL is off, so the 3D scenes can fall back to HTML. */
export const hasWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    // Browsers cap live contexts (8 on Android Chrome): this probe would hold a slot until garbage collection.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
};
