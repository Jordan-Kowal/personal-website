<script lang="ts">
  import { T } from "@threlte/core";
  import { SCENE_COLORS } from "../palette";

  // The grass top is jittered by up to 0.08 in height: a mat this thick clears its highest point.
  const MAT_TOP = 0.1;
  const PLATE_RADIUS = 0.07;
  const DUMBBELL_HEAD_RADIUS = 0.028;
  const DUMBBELLS = [
    { x: -0.2, z: 0.14, turn: 0.2 },
    { x: -0.05, z: 0.16, turn: -0.3 },
  ];
</script>

<!-- A mat with a loaded barbell, two dumbbells and a kettlebell. -->
<T.Group position={[1.15, 0, 1.25]} rotation.y={-0.3}>
  <T.Mesh position.y={MAT_TOP / 2} receiveShadow>
    <T.BoxGeometry args={[0.9, MAT_TOP, 0.5]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.mat} flatShading />
  </T.Mesh>

  <T.Group position={[0, MAT_TOP + PLATE_RADIUS, -0.08]}>
    <T.Mesh rotation.z={Math.PI / 2} castShadow>
      <T.CylinderGeometry args={[0.012, 0.012, 0.8, 5]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.steel} flatShading />
    </T.Mesh>
    {#each [-0.34, -0.3, 0.3, 0.34] as x (x)}
      <T.Mesh position.x={x} rotation.z={Math.PI / 2} castShadow>
        <T.CylinderGeometry args={[PLATE_RADIUS, PLATE_RADIUS, 0.03, 10]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.plate} flatShading />
      </T.Mesh>
    {/each}
  </T.Group>

  {#each DUMBBELLS as dumbbell, i (i)}
    <T.Group
      position={[dumbbell.x, MAT_TOP + DUMBBELL_HEAD_RADIUS, dumbbell.z]}
      rotation.y={dumbbell.turn}
    >
      <T.Mesh rotation.z={Math.PI / 2}>
        <T.CylinderGeometry args={[0.01, 0.01, 0.1, 4]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.steel} flatShading />
      </T.Mesh>
      {#each [-0.05, 0.05] as x (x)}
        <T.Mesh position.x={x} rotation.z={Math.PI / 2} castShadow>
          <T.CylinderGeometry
            args={[DUMBBELL_HEAD_RADIUS, DUMBBELL_HEAD_RADIUS, 0.03, 6]}
          />
          <T.MeshStandardMaterial color={SCENE_COLORS.plate} flatShading />
        </T.Mesh>
      {/each}
    </T.Group>
  {/each}

  <T.Group position={[0.28, MAT_TOP, 0.14]}>
    <T.Mesh position.y={0.055} castShadow>
      <T.IcosahedronGeometry args={[0.055, 1]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.kettlebell} flatShading />
    </T.Mesh>
    <!-- Half a torus in its own plane: the handle arching over the bell. -->
    <T.Mesh position.y={0.1}>
      <T.TorusGeometry args={[0.03, 0.009, 4, 8, Math.PI]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.kettlebell} flatShading />
    </T.Mesh>
  </T.Group>
</T.Group>
