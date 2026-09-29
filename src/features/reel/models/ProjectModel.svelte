<script lang="ts">
  import { T } from "@threlte/core";
  import { DoubleSide } from "three";
  import { wrap } from "../timeline";
  import {
    MODEL_COLORS as C,
    type ProjectModelKind,
    SUDOKU_DIGITS,
  } from "./projectModels";

  type Props = {
    kind: ProjectModelKind;
    t: number;
    seed: number;
  };

  let { kind, t, seed }: Props = $props();

  const SPIN_PER_S = 0.7;
  const TILE = 0.55;
  const TILE_GAP = 0.08;

  // Turntable spin plus a slight bob, both read off `t` so every frame is reproducible.
  const spin = $derived(seed * 1.3 + t * SPIN_PER_S);
  const bob = $derived(Math.sin(t * 2 + seed) * 0.05);
  // The data block sliding through the pipe, looping every 1.5s.
  const flow = $derived(wrap(t + seed, 1.5) / 1.5);
</script>

<T.Group rotation.y={spin} position.y={bob}>
  {#if kind === "sudoku"}
    <T.Mesh position.y={-0.1}>
      <T.BoxGeometry args={[2, 0.16, 2]} />
      <T.MeshStandardMaterial color={C.raised} />
    </T.Mesh>
    {#each SUDOKU_DIGITS as digit, i (i)}
      {@const height = 0.08 + digit * 0.09}
      <T.Mesh
        position={[
          ((i % 3) - 1) * (TILE + TILE_GAP),
          height / 2,
          (Math.floor(i / 3) - 1) * (TILE + TILE_GAP),
        ]}
      >
        <T.BoxGeometry args={[TILE, height, TILE]} />
        <T.MeshStandardMaterial
          color={digit === 9 ? C.accent : digit > 5 ? C.star : C.ink}
          flatShading
        />
      </T.Mesh>
    {/each}
  {:else if kind === "books"}
    <T.Mesh position.y={-0.35}>
      <T.BoxGeometry args={[1.7, 0.36, 1.15]} />
      <T.MeshStandardMaterial color={C.pythonBlue} />
    </T.Mesh>
    <T.Mesh position.y={0.02} rotation.y={0.25}>
      <T.BoxGeometry args={[1.55, 0.32, 1.05]} />
      <T.MeshStandardMaterial color={C.pythonYellow} />
    </T.Mesh>
    <T.Mesh position.y={0.36} rotation.y={-0.18}>
      <T.BoxGeometry args={[1.45, 0.3, 1]} />
      <T.MeshStandardMaterial color={C.ink} />
    </T.Mesh>
    <!-- Bookmark ribbon hanging off the top book. -->
    <T.Mesh position={[0.3, 0.2, 0.5]} rotation.y={-0.18}>
      <T.BoxGeometry args={[0.12, 0.5, 0.02]} />
      <T.MeshStandardMaterial color={C.star} />
    </T.Mesh>
  {:else if kind === "scroll"}
    <T.Mesh position={[0, -0.32, 0.45]}>
      <T.BoxGeometry args={[1.5, 0.04, 1.1]} />
      <T.MeshStandardMaterial color={C.ink} />
    </T.Mesh>
    {#each [-0.15, 0.1, 0.35] as z, i (i)}
      <T.Mesh position={[-0.2 + i * 0.1, -0.29, z + 0.45]}>
        <T.BoxGeometry args={[0.9 - i * 0.2, 0.02, 0.08]} />
        <T.MeshStandardMaterial color={C.javascript} />
      </T.Mesh>
    {/each}
    <T.Mesh position={[0, 0, -0.25]} rotation.z={Math.PI / 2}>
      <T.CylinderGeometry args={[0.34, 0.34, 1.5, 20]} />
      <T.MeshStandardMaterial color={C.ink} />
    </T.Mesh>
    {#each [-0.85, 0.85] as x (x)}
      <T.Mesh position={[x, 0, -0.25]} rotation.z={Math.PI / 2}>
        <T.CylinderGeometry args={[0.4, 0.4, 0.2, 20]} />
        <T.MeshStandardMaterial color={C.javascript} />
      </T.Mesh>
    {/each}
  {:else if kind === "trophy"}
    <T.Mesh position.y={-0.7}>
      <T.BoxGeometry args={[1, 0.3, 1]} />
      <T.MeshStandardMaterial color={C.raised} />
    </T.Mesh>
    <T.Mesh position.y={-0.4}>
      <T.CylinderGeometry args={[0.1, 0.18, 0.4, 12]} />
      <T.MeshStandardMaterial color={C.accentDeep} metalness={0.4} />
    </T.Mesh>
    <T.Mesh position.y={0.2}>
      <T.CylinderGeometry args={[0.65, 0.3, 0.9, 24, 1, true]} />
      <T.MeshStandardMaterial
        color={C.accent}
        metalness={0.4}
        roughness={0.35}
        side={DoubleSide}
      />
    </T.Mesh>
    {#each [-1, 1] as side (side)}
      <T.Mesh position={[side * 0.68, 0.25, 0]} rotation.z={side * 0.2}>
        <T.TorusGeometry args={[0.22, 0.06, 8, 16, Math.PI]} />
        <T.MeshStandardMaterial color={C.accent} metalness={0.4} />
      </T.Mesh>
    {/each}
    <T.Mesh position={[0, -0.7, 0.51]}>
      <T.BoxGeometry args={[0.5, 0.12, 0.02]} />
      <T.MeshStandardMaterial color={C.accent} />
    </T.Mesh>
  {:else if kind === "globe"}
    <T.Mesh>
      <T.IcosahedronGeometry args={[0.75, 1]} />
      <T.MeshStandardMaterial color={C.training} flatShading />
    </T.Mesh>
    {#each [C.accent, C.star] as color, i (color)}
      {@const angle = i * Math.PI}
      <T.Group
        position={[
          Math.cos(angle) * 1.05,
          0.55 - i * 0.5,
          Math.sin(angle) * 1.05,
        ]}
        rotation.y={-angle + Math.PI / 2}
      >
        <T.Mesh>
          <T.BoxGeometry args={[0.7, 0.45, 0.12]} />
          <T.MeshStandardMaterial {color} />
        </T.Mesh>
        <T.Mesh position={[-0.18, -0.3, 0]} rotation.z={Math.PI}>
          <T.ConeGeometry args={[0.1, 0.2, 4]} />
          <T.MeshStandardMaterial {color} />
        </T.Mesh>
        {#each [0.1, -0.06] as y, j (j)}
          <T.Mesh position={[-0.04 + j * 0.06, y, 0.07]}>
            <T.BoxGeometry args={[0.44 - j * 0.12, 0.06, 0.01]} />
            <T.MeshStandardMaterial color={C.raised} />
          </T.Mesh>
        {/each}
      </T.Group>
    {/each}
  {:else if kind === "pipe"}
    <T.Mesh rotation.z={Math.PI / 2}>
      <T.CylinderGeometry args={[0.26, 0.26, 1.7, 20, 1, true]} />
      <T.MeshStandardMaterial
        color={C.steel}
        metalness={0.5}
        roughness={0.4}
        side={DoubleSide}
      />
    </T.Mesh>
    {#each [-0.85, 0.85] as x (x)}
      <T.Mesh position.x={x} rotation.z={Math.PI / 2}>
        <T.CylinderGeometry args={[0.36, 0.36, 0.14, 20, 1, true]} />
        <T.MeshStandardMaterial color={C.accentDeep} side={DoubleSide} />
      </T.Mesh>
    {/each}
    <T.Mesh position.x={1.25} rotation.z={-Math.PI / 2}>
      <T.ConeGeometry args={[0.32, 0.45, 4]} />
      <T.MeshStandardMaterial color={C.accent} flatShading />
    </T.Mesh>
    <T.Mesh position.x={-0.8 + flow * 1.6}>
      <T.BoxGeometry args={[0.24, 0.24, 0.24]} />
      <T.MeshStandardMaterial
        color={C.accent}
        emissive={C.accent}
        emissiveIntensity={0.8}
      />
    </T.Mesh>
  {:else if kind === "toolbox"}
    <T.Mesh position.y={-0.2}>
      <T.BoxGeometry args={[1.6, 0.7, 0.8]} />
      <T.MeshStandardMaterial color={C.django} />
    </T.Mesh>
    <T.Mesh position.y={0.22}>
      <T.BoxGeometry args={[1.66, 0.16, 0.86]} />
      <T.MeshStandardMaterial color={C.djangoDeep} />
    </T.Mesh>
    <T.Mesh position.y={0.3}>
      <T.TorusGeometry args={[0.32, 0.06, 8, 20, Math.PI]} />
      <T.MeshStandardMaterial color={C.steel} metalness={0.5} />
    </T.Mesh>
    <T.Mesh position={[0, 0.05, 0.42]}>
      <T.BoxGeometry args={[0.22, 0.16, 0.04]} />
      <T.MeshStandardMaterial color={C.accent} />
    </T.Mesh>
    <!-- A wrench leaning on the box. -->
    <T.Group position={[0.95, -0.1, 0.1]} rotation.z={-0.35}>
      <T.Mesh>
        <T.BoxGeometry args={[0.1, 0.9, 0.06]} />
        <T.MeshStandardMaterial color={C.steel} metalness={0.5} />
      </T.Mesh>
      <T.Mesh position.y={0.5}>
        <T.TorusGeometry args={[0.12, 0.05, 6, 12, Math.PI * 1.4]} />
        <T.MeshStandardMaterial color={C.steel} metalness={0.5} />
      </T.Mesh>
    </T.Group>
  {:else if kind === "magnifier"}
    {#each [0, 1, 2] as i (i)}
      <T.Mesh
        position={[-0.2 + i * 0.12, -0.5 + i * 0.07, -0.1 + i * 0.1]}
        rotation.y={(i - 1) * 0.2}
      >
        <T.BoxGeometry args={[1.2, 0.05, 0.8]} />
        <T.MeshStandardMaterial color={i === 2 ? C.ink : C.steel} />
      </T.Mesh>
    {/each}
    <T.Group position={[0.1, 0.25, 0.15]} rotation={[-0.9, 0, 0.3]}>
      <T.Mesh>
        <T.TorusGeometry args={[0.45, 0.08, 10, 28]} />
        <T.MeshStandardMaterial color={C.accent} metalness={0.3} />
      </T.Mesh>
      <T.Mesh rotation.x={Math.PI / 2}>
        <T.CylinderGeometry args={[0.42, 0.42, 0.03, 28]} />
        <T.MeshStandardMaterial color={C.training} transparent opacity={0.35} />
      </T.Mesh>
      <T.Mesh position.y={-0.8}>
        <T.CylinderGeometry args={[0.08, 0.1, 0.7, 12]} />
        <T.MeshStandardMaterial color={C.raised} />
      </T.Mesh>
    </T.Group>
  {/if}
</T.Group>
