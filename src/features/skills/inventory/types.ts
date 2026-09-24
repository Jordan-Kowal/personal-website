import type { SkillIcon } from "../icons";

/** One item on the board, placed over its slot: `x`, `y` and `size` are the board's CSS pixels. */
export type InventoryItem = {
  icon: SkillIcon;
  color: string;
  /** One per shape of a multicolour logo, else just `color`. */
  bodyColors: string[];
  /** Fills the logo's cut-outs, so letters like CSS's read against the page. */
  inlayColor: string;
  x: number;
  y: number;
  size: number;
};
