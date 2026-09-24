<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { DodecahedronGeometry, type Mesh } from "three";
  import { SCENE_COLORS } from "../palette";

  type Props = {
    isAnimated: boolean;
  };

  // Three radial segments make the cylinder a triangular prism: an A-frame tent.
  const TENT_RADIUS = 0.5;
  const TENT_LENGTH = 0.9;
  const FIRE = { x: -0.8, z: 1.45 };
  const FIRE_STONES = 7;
  const TRIPOD_APEX = 0.62;
  const TRIPOD_SPREAD = 0.3;
  const TRIPOD_LEG = Math.hypot(TRIPOD_SPREAD, TRIPOD_APEX);
  // Tilts an upright leg so its foot lands `TRIPOD_SPREAD` out and its top on the apex.
  const TRIPOD_TILT = Math.atan2(TRIPOD_SPREAD, TRIPOD_APEX);
  const POT_Y = 0.3;

  let { isAnimated }: Props = $props();

  const stoneGeometry = new DodecahedronGeometry(1, 0);
  let flame: Mesh | undefined = $state();
  let elapsed = 0;

  useTask(
    (delta) => {
      elapsed += Math.min(delta, 1 / 30);
      if (!flame) return;
      // Two unrelated sines, so the flicker never reads as a loop.
      const flicker =
        Math.sin(elapsed * 9) * 0.12 + Math.sin(elapsed * 23) * 0.06;
      flame.scale.set(1 - flicker * 0.5, 1 + flicker, 1 - flicker * 0.5);
    },
    { running: () => isAnimated },
  );
</script>

<!-- The tent, its dark doorway facing the fire. -->
<T.Group position={[-1.05, 0, 0.35]} rotation.y={0.35}>
  <T.Mesh
    position.y={TENT_RADIUS / 2}
    rotation.x={-Math.PI / 2}
    castShadow
    receiveShadow
  >
    <T.CylinderGeometry args={[TENT_RADIUS, TENT_RADIUS, TENT_LENGTH, 3]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.tent} flatShading />
  </T.Mesh>
  <T.Mesh
    position={[0, TENT_RADIUS * 0.4, TENT_LENGTH / 2 + 0.002]}
    rotation.z={Math.PI / 2}
  >
    <T.CircleGeometry args={[TENT_RADIUS * 0.56, 3]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.tentDoor} />
  </T.Mesh>
</T.Group>

<!-- The fire: a ring of stones, crossed logs, a flame, and a pot hung from a tripod. -->
<T.Group position={[FIRE.x, 0, FIRE.z]}>
  {#each { length: FIRE_STONES }, i (i)}
    {@const angle = (i / FIRE_STONES) * Math.PI * 2}
    <T.Mesh
      geometry={stoneGeometry}
      position={[Math.cos(angle) * 0.2, 0.03, Math.sin(angle) * 0.2]}
      rotation={[i, i * 2, 0]}
      scale={0.05}
      castShadow
    >
      <T.MeshStandardMaterial color={SCENE_COLORS.rock} flatShading />
    </T.Mesh>
  {/each}
  {#each [0.6, -0.6] as turn (turn)}
    <T.Mesh position.y={0.03} rotation={[0, turn, Math.PI / 2]}>
      <T.CylinderGeometry args={[0.025, 0.025, 0.3, 5]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.trunk} flatShading />
    </T.Mesh>
  {/each}
  <T.Mesh bind:ref={flame} position.y={0.14}>
    <T.ConeGeometry args={[0.09, 0.24, 6]} />
    <T.MeshStandardMaterial
      color={SCENE_COLORS.flame}
      emissive={SCENE_COLORS.flame}
      emissiveIntensity={2}
      flatShading
    />
  </T.Mesh>
  <T.PointLight
    position.y={0.3}
    color={SCENE_COLORS.flame}
    intensity={1.5}
    distance={1.6}
  />

  {#each [0, 2.1, 4.2] as azimuth (azimuth)}
    <T.Group rotation.y={azimuth}>
      <T.Mesh
        position={[TRIPOD_SPREAD / 2, TRIPOD_APEX / 2, 0]}
        rotation.z={TRIPOD_TILT}
        castShadow
      >
        <T.CylinderGeometry args={[0.012, 0.012, TRIPOD_LEG, 4]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.trunk} flatShading />
      </T.Mesh>
    </T.Group>
  {/each}
  <T.Mesh position.y={(TRIPOD_APEX + POT_Y) / 2 + 0.03}>
    <T.CylinderGeometry args={[0.005, 0.005, TRIPOD_APEX - POT_Y, 3]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.pot} />
  </T.Mesh>
  <T.Mesh position.y={POT_Y} castShadow>
    <T.CylinderGeometry args={[0.1, 0.08, 0.12, 8]} />
    <T.MeshStandardMaterial
      color={SCENE_COLORS.pot}
      flatShading
      metalness={0.4}
    />
  </T.Mesh>
</T.Group>

<!-- A crate for a desk, with the laptop open on it. -->
<T.Group position={[-1.7, 0, 1.05]} rotation.y={0.5}>
  <T.Mesh position.y={0.12} castShadow receiveShadow>
    <T.BoxGeometry args={[0.34, 0.24, 0.26]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.crate} flatShading />
  </T.Mesh>
  <T.Mesh position.y={0.246}>
    <T.BoxGeometry args={[0.2, 0.012, 0.14]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.steel} flatShading />
  </T.Mesh>
  <T.Group position={[0, 0.25, -0.07]} rotation.x={-0.25}>
    <T.Mesh position.y={0.07}>
      <T.BoxGeometry args={[0.2, 0.14, 0.01]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.steel} flatShading />
    </T.Mesh>
    <T.Mesh position={[0, 0.07, 0.006]}>
      <T.PlaneGeometry args={[0.18, 0.12]} />
      <T.MeshStandardMaterial
        color={SCENE_COLORS.screen}
        emissive={SCENE_COLORS.screen}
        emissiveIntensity={1.4}
      />
    </T.Mesh>
  </T.Group>
</T.Group>

<!-- An arcade cabinet: lit marquee, screen, and a slanted panel with a joystick. -->
<T.Group position={[-1.75, 0, -0.05]} rotation.y={0.6}>
  <T.Mesh position.y={0.31} castShadow receiveShadow>
    <T.BoxGeometry args={[0.3, 0.62, 0.26]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.arcade} flatShading />
  </T.Mesh>
  <T.Mesh position={[0, 0.575, 0.131]}>
    <T.PlaneGeometry args={[0.26, 0.06]} />
    <T.MeshStandardMaterial
      color={SCENE_COLORS.window}
      emissive={SCENE_COLORS.window}
      emissiveIntensity={1.6}
    />
  </T.Mesh>
  <T.Mesh position={[0, 0.44, 0.131]}>
    <T.PlaneGeometry args={[0.22, 0.16]} />
    <T.MeshStandardMaterial
      color={SCENE_COLORS.screen}
      emissive={SCENE_COLORS.screen}
      emissiveIntensity={1.4}
    />
  </T.Mesh>
  <T.Mesh position={[0, 0.29, 0.16]} rotation.x={0.35} castShadow>
    <T.BoxGeometry args={[0.3, 0.04, 0.1]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.arcade} flatShading />
  </T.Mesh>
  <T.Mesh position={[-0.06, 0.33, 0.17]}>
    <T.IcosahedronGeometry args={[0.02, 0]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.kettlebell} flatShading />
  </T.Mesh>
</T.Group>
