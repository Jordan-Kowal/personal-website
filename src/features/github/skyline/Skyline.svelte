<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { untrack } from "svelte";
  import { HTML, interactivity, type IntersectionEvent } from "@threlte/extras";
  import {
    BoxGeometry,
    Color,
    InstancedMesh,
    MeshStandardMaterial,
    Object3D,
    type PerspectiveCamera,
  } from "three";
  import type { GitHubContribution } from "../types";
  import { monthStarts, orbitPosition, toWeeks } from "../utils";
  import type { SkylineView } from "./types";

  type Props = {
    contributions: GitHubContribution[];
    /** Where the camera should be; it glides there. */
    view: SkylineView;
    isAnimated: boolean;
    onHover: (contribution: GitHubContribution | null) => void;
  };

  const CELL = 0.28;
  const GAP = 0.06;
  const BASE_HEIGHT = 0.08;
  const HEIGHT_PER_LEVEL = 0.42;
  const RISE_DURATION_S = 0.9;
  const RISE_STAGGER_S = 0.018;
  const VIEW_FOLLOW_RATE = 8;
  const SETTLED_EPSILON = 0.0005;
  // Distance at zoom 1, as a share of the board's width: the whole year fits the frame.
  const RADIUS_PER_WIDTH = 1.01;
  // Taller than the tallest bar, so every month flag stands clear of the city.
  const MARKER_HEIGHT = BASE_HEIGHT + 4 * HEIGHT_PER_LEVEL + 0.5;
  const LOOK_AT_HEIGHT = 0.3;
  const LEVEL_COLORS = ["#2b241d", "#6b5324", "#a57b2a", "#e0a431", "#ffc83d"];
  const HIGHLIGHT_COLOR = "#fff4c2";

  let { contributions, view, isAnimated, onHover }: Props = $props();

  interactivity();
  const { invalidate } = useThrelte();

  // The city is built once from the data it mounts with.
  const weeks = untrack(() => toWeeks(contributions));
  const cells = weeks.flatMap((week, x) =>
    week.flatMap((day, z) => (day ? [{ day, x, z }] : [])),
  );
  const width = weeks.length * (CELL + GAP);
  const depth = 7 * (CELL + GAP);
  const radius = width * RADIUS_PER_WIDTH;
  const toBoardX = (column: number) => column * (CELL + GAP) - width / 2;
  const toBoardZ = (row: number) => row * (CELL + GAP) - depth / 2;
  const markers = monthStarts(weeks);

  const geometry = new BoxGeometry(CELL, 1, CELL);
  // Pivot at the base, so scaling the height grows each bar upward.
  geometry.translate(0, 0.5, 0);
  const material = new MeshStandardMaterial({ roughness: 0.6 });
  const mesh = new InstancedMesh(geometry, material, cells.length);
  const dummy = new Object3D();
  const color = new Color();
  cells.forEach((cell, i) => {
    mesh.setColorAt(i, color.set(LEVEL_COLORS[cell.day.level]));
  });

  let camera: PerspectiveCamera | undefined = $state();
  let elapsed = 0;
  let highlighted: number | undefined;
  // The camera's own view, gliding toward `view`.
  const current = untrack(() => ({ ...view }));

  const easeOutBack = (t: number) => {
    const overshoot = 1.4;
    return 1 + (overshoot + 1) * (t - 1) ** 3 + overshoot * (t - 1) ** 2;
  };

  // Bars rise week by week from left to right, each with a small overshoot.
  const placeBars = (time: number) => {
    cells.forEach((cell, i) => {
      const local = (time - cell.x * RISE_STAGGER_S) / RISE_DURATION_S;
      const rise = local <= 0 ? 0 : local >= 1 ? 1 : easeOutBack(local);
      const height = BASE_HEIGHT + cell.day.level * HEIGHT_PER_LEVEL;
      dummy.position.set(toBoardX(cell.x), 0, toBoardZ(cell.z));
      dummy.scale.set(1, Math.max(0.001, height * rise), 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  const placeCamera = () => {
    if (!camera) return;
    camera.position.set(
      ...orbitPosition({
        azimuth: current.azimuth,
        polar: current.polar,
        radius: radius / current.zoom,
      }),
    );
    camera.lookAt(0, LOOK_AT_HEIGHT, 0);
  };

  const riseEnd = RISE_DURATION_S + weeks.length * RISE_STAGGER_S;
  placeBars(untrack(() => (isAnimated ? 0 : riseEnd)));

  // The loop only runs while bars rise or the camera catches up with the view, then goes idle.
  let isSettled = $state(false);

  useTask(
    (delta) => {
      const step = Math.min(delta, 1 / 30);
      if (elapsed < riseEnd) {
        elapsed += step;
        placeBars(elapsed);
      }
      const follow = 1 - Math.exp(-VIEW_FOLLOW_RATE * step);
      current.azimuth += (view.azimuth - current.azimuth) * follow;
      current.polar += (view.polar - current.polar) * follow;
      current.zoom += (view.zoom - current.zoom) * follow;
      placeCamera();
      isSettled =
        elapsed >= riseEnd &&
        Math.abs(view.azimuth - current.azimuth) < SETTLED_EPSILON &&
        Math.abs(view.polar - current.polar) < SETTLED_EPSILON &&
        Math.abs(view.zoom - current.zoom) < SETTLED_EPSILON;
    },
    { running: () => isAnimated && !isSettled },
  );

  $effect(() => {
    view.azimuth;
    view.polar;
    view.zoom;
    isSettled = false;
  });

  // Without the loop, the view applies directly and one frame is drawn.
  $effect(() => {
    if (isAnimated || !camera) return;
    Object.assign(current, view);
    placeCamera();
    invalidate();
  });

  const paint = (index: number | undefined, value: string) => {
    if (index === undefined) return;
    mesh.setColorAt(index, color.set(value));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  // The building under the pointer lights up, so it's clear which day the caption reads.
  const highlight = (index: number | undefined) => {
    if (index === highlighted) return;
    if (highlighted !== undefined) {
      paint(highlighted, LEVEL_COLORS[cells[highlighted].day.level]);
    }
    paint(index, HIGHLIGHT_COLOR);
    highlighted = index;
    onHover(index === undefined ? null : (cells[index]?.day ?? null));
    invalidate();
  };
</script>

<T.PerspectiveCamera
  makeDefault
  bind:ref={camera}
  fov={30}
  oncreate={() => placeCamera()}
/>
<T.HemisphereLight args={["#ffe2b8", "#2a1f16", 1.1]} />
<T.DirectionalLight position={[6, 10, 6]} intensity={2.2} color="#ffd08a" />
<T.DirectionalLight position={[-8, 3, -4]} intensity={0.8} color="#ff9a4d" />

<T
  is={mesh}
  onpointermove={(event: IntersectionEvent<PointerEvent>) =>
    highlight(event.instanceId)}
  onpointerleave={() => highlight(undefined)}
/>
<!-- The board under the city. -->
<T.Mesh position.y={-0.06}>
  <T.BoxGeometry args={[width + 0.4, 0.12, depth + 0.4]} />
  <T.MeshStandardMaterial color="#1d1814" roughness={0.9} />
</T.Mesh>

<!-- A flag on the 1st of each month: a thin pole over that day, its name on top. -->
{#each markers as marker (`${marker.column}-${marker.row}`)}
  <T.Mesh
    position={[
      toBoardX(marker.column),
      MARKER_HEIGHT / 2,
      toBoardZ(marker.row),
    ]}
  >
    <T.CylinderGeometry args={[0.012, 0.012, MARKER_HEIGHT, 4]} />
    <T.MeshBasicMaterial color="#a89a8b" transparent opacity={0.55} />
  </T.Mesh>
  <HTML
    position={[
      toBoardX(marker.column),
      MARKER_HEIGHT + 0.12,
      toBoardZ(marker.row),
    ]}
    center
    pointerEvents="none"
  >
    <span class="month">{marker.label}</span>
  </HTML>
{/each}

<style>
  .month {
    display: block;
    padding: 0.05rem 0.35rem;
    border-radius: 6px;
    background: rgb(20 17 14 / 0.75);
    font-family: var(--font-display);
    font-size: 0.7rem;
    color: var(--color-muted);
    white-space: nowrap;
  }
</style>
