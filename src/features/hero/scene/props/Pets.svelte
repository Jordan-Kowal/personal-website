<script lang="ts">
  import { T } from "@threlte/core";
  import { SCENE_COLORS } from "../palette";

  // Both are modelled facing +x, side by side, and the pair is turned toward the fire.
  const DOG_LEGS = [
    [0.1, 0.045],
    [0.1, -0.045],
    [-0.1, 0.045],
    [-0.1, -0.045],
  ];
  const CAT_LEGS = [
    [0.07, 0.03],
    [0.07, -0.03],
    [-0.07, 0.03],
    [-0.07, -0.03],
  ];
  // The pair is turned half round, so the camera side is -z here.
  const CAT_Z = -0.17;
</script>

<T.Group position={[-0.3, 0, 1.2]} rotation.y={Math.PI + 0.3}>
  <!-- The akita: red coat, cream muzzle and chest, tail curled over its back. -->
  <T.Mesh position.y={0.17} castShadow>
    <T.BoxGeometry args={[0.3, 0.13, 0.13]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.akita} flatShading />
  </T.Mesh>
  {#each DOG_LEGS as [x, z], i (i)}
    <T.Mesh position={[x, 0.055, z]} castShadow>
      <T.BoxGeometry args={[0.04, 0.11, 0.04]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.akita} flatShading />
    </T.Mesh>
  {/each}
  <T.Mesh position={[0.14, 0.18, 0]}>
    <T.BoxGeometry args={[0.05, 0.08, 0.1]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.cream} flatShading />
  </T.Mesh>
  <T.Mesh position={[0.18, 0.27, 0]} castShadow>
    <T.BoxGeometry args={[0.12, 0.11, 0.11]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.akita} flatShading />
  </T.Mesh>
  <T.Mesh position={[0.26, 0.25, 0]}>
    <T.BoxGeometry args={[0.06, 0.05, 0.07]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.cream} flatShading />
  </T.Mesh>
  <T.Mesh position={[0.295, 0.265, 0]}>
    <T.BoxGeometry args={[0.015, 0.015, 0.02]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.catBlack} />
  </T.Mesh>
  {#each [0.035, -0.035] as z (z)}
    <T.Mesh position={[0.17, 0.345, z]}>
      <T.ConeGeometry args={[0.025, 0.05, 4]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.akita} flatShading />
    </T.Mesh>
  {/each}
  <T.Mesh position={[-0.17, 0.27, 0]}>
    <T.TorusGeometry args={[0.04, 0.018, 5, 10, Math.PI * 1.5]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.akita} flatShading />
  </T.Mesh>

  <!-- The cat, standing by its friend: a smaller akita build, white with a grey saddle, black head, tail straight up. -->
  <T.Group position={[0.06, 0, CAT_Z]}>
    <T.Mesh position.y={0.12} castShadow>
      <T.BoxGeometry args={[0.2, 0.09, 0.09]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.cream} flatShading />
    </T.Mesh>
    <T.Mesh position={[-0.02, 0.17, 0]}>
      <T.BoxGeometry args={[0.12, 0.012, 0.094]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.catGrey} flatShading />
    </T.Mesh>
    {#each CAT_LEGS as [x, z], i (i)}
      <T.Mesh position={[x, 0.04, z]} castShadow>
        <T.BoxGeometry args={[0.03, 0.08, 0.03]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.cream} flatShading />
      </T.Mesh>
    {/each}
    <T.Mesh position={[0.12, 0.19, 0]} castShadow>
      <T.BoxGeometry args={[0.09, 0.08, 0.09]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.catBlack} flatShading />
    </T.Mesh>
    <T.Mesh position={[0.166, 0.175, 0]}>
      <T.BoxGeometry args={[0.006, 0.03, 0.04]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.cream} flatShading />
    </T.Mesh>
    {#each [0.022, -0.022] as z (z)}
      <T.Mesh position={[0.166, 0.2, z]}>
        <T.BoxGeometry args={[0.006, 0.014, 0.012]} />
        <T.MeshStandardMaterial
          color={SCENE_COLORS.window}
          emissive={SCENE_COLORS.window}
          emissiveIntensity={0.8}
        />
      </T.Mesh>
      <T.Mesh position={[0.11, 0.25, z * 1.3]}>
        <T.ConeGeometry args={[0.02, 0.045, 4]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.catBlack} flatShading />
      </T.Mesh>
    {/each}
    <T.Mesh position={[-0.1, 0.24, 0]}>
      <T.BoxGeometry args={[0.02, 0.16, 0.02]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.catGrey} flatShading />
    </T.Mesh>
    <T.Mesh position={[-0.1, 0.33, 0]}>
      <T.BoxGeometry args={[0.022, 0.03, 0.022]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.catBlack} flatShading />
    </T.Mesh>
  </T.Group>
</T.Group>
