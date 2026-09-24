export type CardSpot = { x: number; y: number; rotation: number };

const MAX_COLUMNS = 3;
const COLUMN_GAP_PX = 24;
const ROW_GAP_PX = 28;
const JITTER_X_PX = 26;
const JITTER_Y_PX = 16;
const MAX_TILT_DEGREES = 6;

/** Deterministic noise in [-1, 1], so the table looks tossed but lays out the same on every visit. */
export const wobble = (index: number, salt: number) => {
  const value = Math.sin(index * 91.7 + salt * 47.3) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

/**
 * Where each card lands on a table `width` px wide: a loose grid, a little off-true, the last row centred.
 * `height` is the table height the layout needs.
 */
export const scatterLayout = ({
  count,
  width,
  cardWidth,
  cardHeight,
}: {
  count: number;
  width: number;
  cardWidth: number;
  cardHeight: number;
}): { spots: CardSpot[]; height: number } => {
  const columns = Math.max(
    1,
    Math.min(
      MAX_COLUMNS,
      Math.floor((width + COLUMN_GAP_PX) / (cardWidth + COLUMN_GAP_PX)),
    ),
  );
  const rows = Math.ceil(count / columns);
  const cellWidth = width / columns;
  const rowHeight = cardHeight + ROW_GAP_PX;
  // Jitter never pushes a card past its cell, so neighbours overlap at most by the tilt.
  const jitterX = Math.max(
    0,
    Math.min(JITTER_X_PX, (cellWidth - cardWidth) / 2),
  );
  const spots = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / columns);
    const itemsInRow = Math.min(columns, count - row * columns);
    const rowOffset = ((columns - itemsInRow) * cellWidth) / 2;
    const column = i % columns;
    return {
      x:
        rowOffset +
        column * cellWidth +
        (cellWidth - cardWidth) / 2 +
        wobble(i, 1) * jitterX,
      y: JITTER_Y_PX + row * rowHeight + wobble(i, 2) * JITTER_Y_PX,
      rotation: wobble(i, 3) * MAX_TILT_DEGREES,
    };
  });
  return { spots, height: rows * rowHeight + JITTER_Y_PX * 2 };
};

/** Keeps a card of `cardWidth` × `cardHeight` px inside the table. */
export const clampToTable = ({
  x,
  y,
  cardWidth,
  cardHeight,
  tableWidth,
  tableHeight,
}: {
  x: number;
  y: number;
  cardWidth: number;
  cardHeight: number;
  tableWidth: number;
  tableHeight: number;
}) => ({
  x: Math.min(Math.max(0, x), Math.max(0, tableWidth - cardWidth)),
  y: Math.min(Math.max(0, y), Math.max(0, tableHeight - cardHeight)),
});

/** Moves `index` to the end of the stacking order, so the card picked up lands on top of the others. */
export const bringToFront = (order: number[], index: number) => [
  ...order.filter((item) => item !== index),
  index,
];
