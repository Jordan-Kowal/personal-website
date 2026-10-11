export const HeroView = {
  Trailer: "trailer",
  Hobbies: "hobbies",
} as const;
export type HeroView = (typeof HeroView)[keyof typeof HeroView];

const HERO_VIEWS: readonly string[] = Object.values(HeroView);

/** The view a link asks the hero to open with `?open=`, so outside pages can land on it. */
export const parseOpenParam = (search: string): HeroView | undefined => {
  const value = new URLSearchParams(search).get("open");
  return value !== null && HERO_VIEWS.includes(value)
    ? (value as HeroView)
    : undefined;
};
