<script lang="ts">
  import { T } from "@threlte/core";
  import { SCENE_COLORS } from "../palette";

  const TABLE_TOP = 0.2;
  const TABLE_WIDTH = 0.3;
  const TABLE_DEPTH = 0.26;
  const SEAT_TOP = 0.1;
  const HEAD_RADIUS = 0.05;
  const HEAD_Y = 0.31;
  // Each friend is drawn facing +x on their stool, then turned to face the table from their side.
  const FRIENDS = [
    {
      x: -0.25,
      turn: 0,
      shirt: SCENE_COLORS.shirts[0],
      hair: SCENE_COLORS.hair[0],
      hasLongHair: false,
    },
    {
      x: 0.25,
      turn: Math.PI,
      shirt: SCENE_COLORS.shirts[1],
      hair: SCENE_COLORS.hair[1],
      hasLongHair: true,
    },
  ];
  const MEEPLES = [
    { x: -0.04, z: -0.03 },
    { x: 0.03, z: 0.04 },
    { x: 0.05, z: -0.05 },
  ];
</script>

<!-- Two friends at a low table, a board game between them with meeples, a deck and dice. -->
<T.Group position={[-1.3, 0, 2.3]} rotation.y={0.2} scale={1.15}>
  <T.Mesh position.y={TABLE_TOP - 0.01} castShadow receiveShadow>
    <T.BoxGeometry args={[TABLE_WIDTH, 0.02, TABLE_DEPTH]} />
    <T.MeshStandardMaterial color={SCENE_COLORS.crate} flatShading />
  </T.Mesh>
  {#each [-1, 1] as sideX (sideX)}
    {#each [-1, 1] as sideZ (sideZ)}
      <T.Mesh
        position={[
          sideX * (TABLE_WIDTH / 2 - 0.03),
          (TABLE_TOP - 0.02) / 2,
          sideZ * (TABLE_DEPTH / 2 - 0.03),
        ]}
      >
        <T.CylinderGeometry args={[0.012, 0.012, TABLE_TOP - 0.02, 4]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.trunk} flatShading />
      </T.Mesh>
    {/each}
  {/each}

  <T.Group position.y={TABLE_TOP}>
    <T.Mesh position.y={0.004} receiveShadow>
      <T.BoxGeometry args={[0.16, 0.008, 0.16]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.cream} flatShading />
    </T.Mesh>
    {#each MEEPLES as meeple, i (i)}
      <T.Group position={[meeple.x, 0.008, meeple.z]}>
        <T.Mesh position.y={0.014} castShadow>
          <T.ConeGeometry args={[0.012, 0.028, 5]} />
          <T.MeshStandardMaterial color={SCENE_COLORS.holds[i]} flatShading />
        </T.Mesh>
        <T.Mesh position.y={0.032}>
          <T.IcosahedronGeometry args={[0.009, 0]} />
          <T.MeshStandardMaterial color={SCENE_COLORS.holds[i]} flatShading />
        </T.Mesh>
      </T.Group>
    {/each}
    <T.Mesh position={[0.02, 0.008, 0.1]} rotation.y={0.3} castShadow>
      <T.BoxGeometry args={[0.05, 0.016, 0.035]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.crashPad} flatShading />
    </T.Mesh>
    {#each [-0.07, -0.045] as z, i (z)}
      <T.Mesh position={[-0.09, 0.009, z]} rotation.y={i * 0.7} castShadow>
        <T.BoxGeometry args={[0.018, 0.018, 0.018]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.steel} flatShading />
      </T.Mesh>
    {/each}
  </T.Group>

  {#each FRIENDS as friend, i (i)}
    <T.Group position.x={friend.x} rotation.y={friend.turn}>
      <T.Mesh position.y={SEAT_TOP / 2} castShadow>
        <T.CylinderGeometry args={[0.06, 0.06, SEAT_TOP, 7]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.trunk} flatShading />
      </T.Mesh>
      <!-- Thighs along the seat, shins down under the table's edge. -->
      <T.Mesh position={[0.05, SEAT_TOP + 0.02, 0]} castShadow>
        <T.BoxGeometry args={[0.13, 0.04, 0.09]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.jeans} flatShading />
      </T.Mesh>
      <T.Mesh position={[0.1, SEAT_TOP / 2, 0]} castShadow>
        <T.BoxGeometry args={[0.035, SEAT_TOP, 0.08]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.jeans} flatShading />
      </T.Mesh>
      <T.Mesh position={[-0.01, 0.19, 0]} castShadow>
        <T.BoxGeometry args={[0.08, 0.14, 0.12]} />
        <T.MeshStandardMaterial color={friend.shirt} flatShading />
      </T.Mesh>
      <!-- Arms reaching down from the shoulders to rest on the table. -->
      {#each [-0.072, 0.072] as z (z)}
        <T.Mesh position={[0.045, 0.228, z]} rotation.z={-0.2} castShadow>
          <T.BoxGeometry args={[0.11, 0.028, 0.028]} />
          <T.MeshStandardMaterial color={friend.shirt} flatShading />
        </T.Mesh>
      {/each}
      <T.Mesh position.y={HEAD_Y} castShadow>
        <T.IcosahedronGeometry args={[HEAD_RADIUS, 1]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.skin} flatShading />
      </T.Mesh>
      <!-- A hemisphere a little wider than the head, tipped back: the hairline sits above the face. -->
      <T.Mesh position={[-0.006, HEAD_Y + 0.004, 0]} rotation.z={0.35}>
        <T.SphereGeometry
          args={[HEAD_RADIUS * 1.12, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <T.MeshStandardMaterial color={friend.hair} flatShading />
      </T.Mesh>
      {#if friend.hasLongHair}
        <T.Mesh position={[-0.045, HEAD_Y - 0.035, 0]} castShadow>
          <T.BoxGeometry args={[0.035, 0.11, 0.1]} />
          <T.MeshStandardMaterial color={friend.hair} flatShading />
        </T.Mesh>
      {/if}
    </T.Group>
  {/each}
</T.Group>
