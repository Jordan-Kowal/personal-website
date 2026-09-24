// Each anchor sits just above its prop in Island.svelte, in the island's own coordinates.
export const HOBBIES = [
  { id: "climbing", title: "Rock climbing", anchor: [-2, 1.3, -0.8] },
  { id: "biking", title: "Biking", anchor: [-2.15, 0.45, 1.45] },
  { id: "fitness", title: "Fitness", anchor: [1.15, 0.2, 1.25] },
  { id: "pets", title: "Cats & dogs", anchor: [-0.3, 0.45, 1.2] },
  { id: "coding", title: "Coding", anchor: [-1.7, 0.5, 1.05] },
  { id: "gaming", title: "Gaming", anchor: [-1.75, 0.8, -0.05] },
  { id: "cooking", title: "Cooking", anchor: [-0.8, 0.5, 1.45] },
  {
    id: "boardGames",
    title: "Board games & friends",
    anchor: [-1.3, 0.55, 2.3],
  },
] as const satisfies readonly {
  id: string;
  title: string;
  anchor: [number, number, number];
}[];

/** Where a hobby's anchor lands on screen, in normalized device coordinates, and whether nothing on the island hides it. */
export type Hotspot = { x: number; y: number; isInSight: boolean };
