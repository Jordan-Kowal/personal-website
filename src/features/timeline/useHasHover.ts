export const useHasHover = (): (() => boolean) => {
  const match = window.matchMedia("(hover: hover)");
  return () => match.matches;
};
