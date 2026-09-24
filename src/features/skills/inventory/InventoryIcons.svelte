<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { untrack } from "svelte";
  import type { Group, MeshStandardMaterial } from "three";
  import { tiltToward } from "../utils";
  import { buildIconGeometry } from "./iconGeometry";
  import type { InventoryItem } from "./types";

  type Props = {
    items: InventoryItem[];
    /** Per item: whether it's being inspected, so it spins and grows. */
    spinning: boolean[];
    /** Per item: whether a category filter leaves it out. */
    dimmed: boolean[];
    /** Pointer in the board's CSS pixels. */
    pointer: { x: number; y: number; isInside: boolean };
    isAnimated: boolean;
  };

  // A slight turn at rest shows the logos' thickness without skewing the thin line icons.
  const IDLE_TILT = { x: 0.25, y: -0.22 };
  const POINTER_REACH_PX = 420;
  const POINTER_MAX_ANGLE = 0.45;
  const SPIN_RADIANS_PER_SECOND = 4;
  const ACTIVE_SCALE = 1.22;
  const DIMMED_SCALE = 0.82;
  const DIMMED_OPACITY = 0.22;
  const FOLLOW_RATE = 9;
  const SETTLED_EPSILON = 0.0005;
  const FULL_TURN = Math.PI * 2;
  const VIEWBOX_SIZE = 24;

  let { items, spinning, dimmed, pointer, isAnimated }: Props = $props();

  const { size, invalidate } = useThrelte();

  // Icons never change once the board mounts, only their positions do.
  const geometries = untrack(() =>
    items.map((item) => buildIconGeometry(item.icon)),
  );
  const groups: Group[] = $state([]);
  const bodyMaterials: MeshStandardMaterial[] = $state([]);
  const inlayMaterials: MeshStandardMaterial[] = $state([]);
  const poses = geometries.map(() => ({
    x: IDLE_TILT.x,
    y: IDLE_TILT.y,
    spin: 0,
    scale: 1,
    opacity: 1,
  }));

  const nearestTurn = (angle: number) =>
    Math.round(angle / FULL_TURN) * FULL_TURN;

  // Moves one item a step toward its goal and says whether it still has somewhere to go.
  const stepItem = (index: number, follow: number, step: number) => {
    const item = items[index];
    const pose = poses[index];
    const isActive = spinning[index];
    // Reduced motion keeps items still: no following the pointer.
    const tilt =
      isAnimated && pointer.isInside
        ? tiltToward({
            dx: pointer.x - item.x,
            dy: pointer.y - item.y,
            reach: POINTER_REACH_PX,
            maxAngle: POINTER_MAX_ANGLE,
          })
        : { x: 0, y: 0 };
    const isDimmed = dimmed[index] && !isActive;
    const goal = {
      x: IDLE_TILT.x + tilt.x,
      y: IDLE_TILT.y + tilt.y,
      scale: isActive ? ACTIVE_SCALE : isDimmed ? DIMMED_SCALE : 1,
      opacity: isDimmed ? DIMMED_OPACITY : 1,
    };
    pose.x += (goal.x - pose.x) * follow;
    pose.y += (goal.y - pose.y) * follow;
    pose.scale += (goal.scale - pose.scale) * follow;
    pose.opacity += (goal.opacity - pose.opacity) * follow;
    // The inspected item spins; let go, it finishes on the closest full turn.
    if (isActive) pose.spin += SPIN_RADIANS_PER_SECOND * step;
    else pose.spin += (nearestTurn(pose.spin) - pose.spin) * follow;
    return (
      isActive ||
      Math.abs(goal.x - pose.x) > SETTLED_EPSILON ||
      Math.abs(goal.y - pose.y) > SETTLED_EPSILON ||
      Math.abs(goal.scale - pose.scale) > SETTLED_EPSILON ||
      Math.abs(goal.opacity - pose.opacity) > SETTLED_EPSILON ||
      Math.abs(nearestTurn(pose.spin) - pose.spin) > SETTLED_EPSILON
    );
  };

  const applyPose = (index: number) => {
    const group = groups[index];
    const pose = poses[index];
    if (!group) return;
    for (const material of [bodyMaterials[index], inlayMaterials[index]]) {
      if (material) material.opacity = pose.opacity;
    }
    group.rotation.set(pose.x, pose.y + pose.spin, 0);
    group.scale.setScalar((items[index].size / VIEWBOX_SIZE) * pose.scale);
  };

  // Frames are only requested while something moves, so a still board costs nothing.
  useTask(
    (delta) => {
      const step = Math.min(delta, 1 / 30);
      const follow = 1 - Math.exp(-FOLLOW_RATE * step);
      let isMoving = false;
      for (let i = 0; i < poses.length; i++) {
        if (stepItem(i, follow, step)) isMoving = true;
        applyPose(i);
      }
      if (isMoving) invalidate();
    },
    { autoInvalidate: false, running: () => isAnimated },
  );

  // Any input wakes the loop up again.
  $effect(() => {
    pointer.x;
    pointer.y;
    pointer.isInside;
    spinning;
    dimmed;
    items;
    invalidate();
  });

  // Without the loop, the resting pose is applied once: a single full step lands every item on its goal.
  $effect(() => {
    if (isAnimated) return;
    items;
    dimmed;
    spinning;
    for (let i = 0; i < groups.length; i++) {
      stepItem(i, 1, 0);
      applyPose(i);
    }
    invalidate();
  });
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 500]} near={1} far={1000} />
<T.HemisphereLight args={["#fff1dc", "#2a1f16", 1.8]} />
<T.DirectionalLight position={[-200, 300, 400]} intensity={3} color="#ffe2b8" />
<T.DirectionalLight
  position={[300, -100, -200]}
  intensity={1}
  color="#ff9a4d"
/>

{#each items as item, i (i)}
  <T.Group
    bind:ref={groups[i]}
    position={[item.x - $size.width / 2, $size.height / 2 - item.y, 0]}
    rotation={[IDLE_TILT.x, IDLE_TILT.y, 0]}
    scale={item.size / VIEWBOX_SIZE}
  >
    <T.Mesh geometry={geometries[i].body}>
      <T.MeshStandardMaterial
        bind:ref={bodyMaterials[i]}
        color={item.color}
        roughness={0.4}
        metalness={0.15}
        emissive={item.color}
        emissiveIntensity={0.18}
        transparent
      />
    </T.Mesh>
    {#if geometries[i].inlay}
      <T.Mesh geometry={geometries[i].inlay}>
        <T.MeshStandardMaterial
          bind:ref={inlayMaterials[i]}
          color={item.inlayColor}
          roughness={0.6}
          transparent
        />
      </T.Mesh>
    {/if}
  </T.Group>
{/each}
