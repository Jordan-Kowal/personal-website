// A 3D stand-in for every project that has no screenshot, picked from what its description says it is.

export type ProjectModelKind =
  | "books"
  | "scroll"
  | "trophy"
  | "globe"
  | "sudoku"
  | "pipe"
  | "toolbox"
  | "magnifier";

export const PROJECT_MODELS: Partial<Record<string, ProjectModelKind>> = {
  jklib: "books",
  jkscript: "scroll",
  challenges: "trophy",
  "django-database-translation": "globe",
  "sudoku-manager": "sudoku",
  "pipe-operator": "pipe",
  "django-utils-kit": "toolbox",
  "django-meilisearch-indexer": "magnifier",
};

// Three.js cannot read CSS variables: these mirror the tokens in `styles/index.css`, plus brand colours.
export const MODEL_COLORS = {
  accent: "#ffc83d",
  accentDeep: "#f59e0b",
  star: "#ff8a4c",
  ink: "#f4ede4",
  raised: "#262019",
  line: "#342b22",
  training: "#6cb8ff",
  steel: "#c9c3b8",
  pythonBlue: "#3776ab",
  pythonYellow: "#ffd43b",
  javascript: "#f7df1e",
  django: "#2ba977",
  djangoDeep: "#1c7a55",
} as const;

// A digit per cell, read row by row: the board's tiles rise to their digit.
export const SUDOKU_DIGITS: readonly number[] = [5, 3, 8, 1, 9, 4, 7, 2, 6];
