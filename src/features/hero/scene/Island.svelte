<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { useCursor } from "@threlte/extras";
  import {
    CatmullRomCurve3,
    ConeGeometry,
    CylinderGeometry,
    DodecahedronGeometry,
    DoubleSide,
    type Group,
    Plane,
    Raycaster,
    TubeGeometry,
    Vector2,
    Vector3,
  } from "three";
  import {
    computeLean,
    jitterPositions,
    pointOnCone,
    segmentBetween,
  } from "./islandMath";
  import { SCENE_COLORS } from "./palette";

  type Props = {
    /** Pointer in normalized device coordinates, [-1, 1] on both axes. */
    pointer: { x: number; y: number; isInside: boolean };
    isAnimated: boolean;
  };

  const TOP_RADIUS = 3.2;
  const TOP_HEIGHT = 0.5;
  const UNDERSIDE_HEIGHT = 2.8;
  const LEAN_RADIUS = 2.4;
  const LEAN_MAX_ANGLE = 0.45;
  const LEAN_FOLLOW_RATE = 6;
  const WOBBLE_STIFFNESS = 90;
  const WOBBLE_DAMPING = 7;
  const WOBBLE_KICK = 5;

  const TREES = [
    { x: 1.6, z: -0.9, scale: 1.15, color: SCENE_COLORS.foliage[0] },
    { x: 2.1, z: 0.5, scale: 0.85, color: SCENE_COLORS.foliage[1] },
    { x: 0.9, z: -1.9, scale: 0.95, color: SCENE_COLORS.foliage[2] },
    { x: -1.0, z: -2.3, scale: 1.1, color: SCENE_COLORS.foliage[3] },
    { x: 0.15, z: -2.45, scale: 0.8, color: SCENE_COLORS.foliage[1] },
    { x: -2.4, z: 0.6, scale: 0.9, color: SCENE_COLORS.foliage[0] },
    { x: 1.2, z: 1.8, scale: 0.75, color: SCENE_COLORS.foliage[2] },
  ];
  const ROCKS = [
    { x: 2.5, z: -0.2, scale: 0.28 },
    { x: -1.2, z: 2.1, scale: 0.34 },
    { x: 0.2, z: -1.2, scale: 0.2 },
  ];

  // The climbing crag: a jittered cone with a route of holds, a rope down it, and a pad at its foot.
  const CRAG = { x: -2.0, z: -1.2, radius: 0.9, height: 2.3 };
  // The route climbs the side facing +z, the one the camera sees first.
  const ROUTE_ANGLE = Math.PI / 2;
  const HOLDS = [
    { angle: -0.35, y: 0.25, scale: 0.075 },
    { angle: 0.3, y: 0.5, scale: 0.065 },
    { angle: -0.15, y: 0.78, scale: 0.07 },
    { angle: 0.35, y: 1.02, scale: 0.06 },
    { angle: -0.3, y: 1.25, scale: 0.06 },
    { angle: 0.1, y: 1.48, scale: 0.055 },
    { angle: -0.2, y: 1.72, scale: 0.05 },
  ].map((hold, i) => ({
    position: pointOnCone({
      radius: CRAG.radius,
      height: CRAG.height,
      angle: ROUTE_ANGLE + hold.angle,
      y: hold.y,
      offset: 0.07,
    }),
    scale: hold.scale,
    color: SCENE_COLORS.holds[i % SCENE_COLORS.holds.length],
  }));

  // A stream from a spring by the crag, winding between the cottage and the trees, falling off the front edge.
  const RIVER_PATH: [number, number][] = [
    [-1.3, -0.35],
    [-0.45, 0.1],
    [0.3, 0.95],
    [0.15, 1.9],
    [0.5, 2.7],
    [0.62, 3.25],
  ];
  const RIVER_HALF_WIDTH = 0.16;
  // The tube is squashed into a ribbon: thick enough to show over the jittered grass, still flat.
  const RIVER_FLATTEN = 0.5;
  const WATERFALL_HEIGHT = 1.1;

  // The bike, drawn side-on in its own plane: hubs, bottom bracket, saddle and head of the frame.
  const WHEEL_RADIUS = 0.13;
  const BIKE_POINTS = {
    rearHub: [-0.2, WHEEL_RADIUS],
    frontHub: [0.2, WHEEL_RADIUS],
    bracket: [-0.02, 0.12],
    saddle: [-0.07, 0.33],
    head: [0.14, 0.33],
  } satisfies Record<string, [number, number]>;
  const BIKE_TUBES = [
    ["rearHub", "bracket"],
    ["rearHub", "saddle"],
    ["bracket", "saddle"],
    ["saddle", "head"],
    ["bracket", "head"],
    ["head", "frontHub"],
  ] as const;
  const BIKE_FRAME = BIKE_TUBES.map(([from, to]) =>
    segmentBetween(BIKE_POINTS[from], BIKE_POINTS[to]),
  );

  let { pointer, isAnimated }: Props = $props();

  const { camera } = useThrelte();
  const { onPointerEnter, onPointerLeave } = useCursor();

  const topGeometry = new CylinderGeometry(
    TOP_RADIUS,
    TOP_RADIUS * 0.94,
    TOP_HEIGHT,
    11,
    1,
  );
  jitterPositions({
    positions: topGeometry.attributes.position.array as Float32Array,
    amount: 0.08,
    seed: 1,
  });
  topGeometry.computeVertexNormals();

  const undersideGeometry = new ConeGeometry(
    TOP_RADIUS * 0.94,
    UNDERSIDE_HEIGHT,
    11,
    3,
  );
  // The ring touching the grass stays put so the two halves meet without a gap.
  jitterPositions({
    positions: undersideGeometry.attributes.position.array as Float32Array,
    amount: 0.28,
    seed: 2,
    isPinned: (y) => y <= -UNDERSIDE_HEIGHT / 2 + 0.001,
  });
  undersideGeometry.computeVertexNormals();

  const rockGeometry = new DodecahedronGeometry(1, 0);

  const cragGeometry = new ConeGeometry(CRAG.radius, CRAG.height, 7, 4);
  // The base ring stays put so the crag sits flush on the grass.
  jitterPositions({
    positions: cragGeometry.attributes.position.array as Float32Array,
    amount: 0.1,
    seed: 3,
    isPinned: (y) => y <= -CRAG.height / 2 + 0.001,
  });
  cragGeometry.computeVertexNormals();

  // The rope hangs from the top anchor down the route, with a slight sway.
  const ROPE_POINTS = 9;
  const ropeGeometry = new TubeGeometry(
    new CatmullRomCurve3(
      Array.from({ length: ROPE_POINTS }, (_, i) => {
        const y = CRAG.height * 0.94 * (1 - i / (ROPE_POINTS - 1)) + 0.02;
        const sway = Math.sin(i * 1.3) * 0.08;
        return new Vector3(
          ...pointOnCone({
            radius: CRAG.radius,
            height: CRAG.height,
            angle: ROUTE_ANGLE + 0.12 + sway,
            y,
            offset: 0.05,
          }),
        );
      }),
    ),
    32,
    0.016,
    5,
  );

  const riverGeometry = new TubeGeometry(
    new CatmullRomCurve3(
      RIVER_PATH.map(([x, z]) => new Vector3(x, 0, z)),
      false,
      "centripetal",
    ),
    48,
    RIVER_HALF_WIDTH,
    6,
  );
  const [riverMouthX, riverMouthZ] = RIVER_PATH[RIVER_PATH.length - 1];
  const [springX, springZ] = RIVER_PATH[0];

  let island: Group | undefined = $state();
  const treeGroups: Group[] = $state([]);
  const leans = TREES.map(() => ({ x: 0, z: 0 }));
  const wobbles = TREES.map(() => ({ angle: 0, velocity: 0 }));

  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const hit = new Vector3();
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0);

  const poke = (index: number) => {
    wobbles[index].velocity += WOBBLE_KICK;
  };

  // Where the pointer touches the island's top plane, in the island's own coordinates.
  const pointerOnIsland = (): Vector3 | undefined => {
    if (!island || !pointer.isInside) return undefined;
    ndc.set(pointer.x, pointer.y);
    raycaster.setFromCamera(ndc, camera.current);
    island.getWorldPosition(hit);
    groundPlane.constant = -hit.y;
    if (!raycaster.ray.intersectPlane(groundPlane, hit)) return undefined;
    return island.worldToLocal(hit);
  };

  const updateTree = (index: number, delta: number, target?: Vector3) => {
    const tree = TREES[index];
    const goal = target
      ? computeLean({
          treeX: tree.x,
          treeZ: tree.z,
          pointerX: target.x,
          pointerZ: target.z,
          radius: LEAN_RADIUS,
          maxAngle: LEAN_MAX_ANGLE,
        })
      : { x: 0, z: 0 };
    const follow = 1 - Math.exp(-LEAN_FOLLOW_RATE * delta);
    leans[index].x += (goal.x - leans[index].x) * follow;
    leans[index].z += (goal.z - leans[index].z) * follow;

    const wobble = wobbles[index];
    const acceleration =
      -WOBBLE_STIFFNESS * wobble.angle - WOBBLE_DAMPING * wobble.velocity;
    wobble.velocity += acceleration * delta;
    wobble.angle += wobble.velocity * delta;

    const group = treeGroups[index];
    if (!group) return;
    group.rotation.x = leans[index].x;
    group.rotation.z = leans[index].z + wobble.angle * 0.35;
  };

  useTask(
    (delta) => {
      // A long pause (tab hidden) would otherwise fling the springs.
      const step = Math.min(delta, 1 / 30);
      const target = pointerOnIsland();
      for (let i = 0; i < TREES.length; i++) updateTree(i, step, target);
    },
    { running: () => isAnimated },
  );
</script>

<T.Group bind:ref={island}>
  <T.Mesh
    geometry={topGeometry}
    position.y={-TOP_HEIGHT / 2}
    receiveShadow
    castShadow
  >
    <T.MeshStandardMaterial
      color={SCENE_COLORS.grass}
      flatShading
      roughness={0.95}
    />
  </T.Mesh>
  <T.Mesh
    geometry={undersideGeometry}
    position.y={-TOP_HEIGHT - UNDERSIDE_HEIGHT / 2 + 0.02}
    rotation.x={Math.PI}
    castShadow
  >
    <T.MeshStandardMaterial
      color={SCENE_COLORS.dirt}
      flatShading
      roughness={1}
    />
  </T.Mesh>

  {#each TREES as tree, i (i)}
    <T.Group
      bind:ref={treeGroups[i]}
      position={[tree.x, 0, tree.z]}
      scale={tree.scale}
      onclick={() => poke(i)}
      onpointerenter={onPointerEnter}
      onpointerleave={onPointerLeave}
    >
      <T.Mesh position.y={0.25} castShadow>
        <T.CylinderGeometry args={[0.07, 0.11, 0.5, 5]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.trunk} flatShading />
      </T.Mesh>
      <T.Mesh position.y={0.85} castShadow>
        <T.ConeGeometry args={[0.5, 0.9, 6]} />
        <T.MeshStandardMaterial color={tree.color} flatShading />
      </T.Mesh>
      <T.Mesh position.y={1.25} castShadow>
        <T.ConeGeometry args={[0.36, 0.7, 6]} />
        <T.MeshStandardMaterial color={tree.color} flatShading />
      </T.Mesh>
    </T.Group>
  {/each}

  {#each ROCKS as rock, i (i)}
    <T.Mesh
      geometry={rockGeometry}
      position={[rock.x, rock.scale * 0.4, rock.z]}
      scale={rock.scale}
      rotation={[i, i * 2, 0]}
      castShadow
      receiveShadow
    >
      <T.MeshStandardMaterial color={SCENE_COLORS.rock} flatShading />
    </T.Mesh>
  {/each}

  <T.Group position={[CRAG.x, 0, CRAG.z]}>
    <T.Mesh
      geometry={cragGeometry}
      position.y={CRAG.height / 2}
      castShadow
      receiveShadow
    >
      <T.MeshStandardMaterial color={SCENE_COLORS.cliff} flatShading />
    </T.Mesh>
    {#each HOLDS as hold, i (i)}
      <T.Mesh
        geometry={rockGeometry}
        position={hold.position}
        scale={hold.scale}
        rotation={[i, i * 1.7, 0]}
      >
        <T.MeshStandardMaterial color={hold.color} flatShading />
      </T.Mesh>
    {/each}
    <T.Mesh geometry={ropeGeometry} castShadow>
      <T.MeshStandardMaterial color={SCENE_COLORS.rope} roughness={0.8} />
    </T.Mesh>
    <!-- Summit flag, planted a little into the peak because the jitter moves the tip. -->
    <T.Group position.y={CRAG.height - 0.12}>
      <T.Mesh position.y={0.18}>
        <T.CylinderGeometry args={[0.012, 0.012, 0.36, 4]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.trunk} />
      </T.Mesh>
      <T.Mesh position={[0.09, 0.3, 0]}>
        <T.PlaneGeometry args={[0.18, 0.11]} />
        <T.MeshStandardMaterial
          color={SCENE_COLORS.window}
          side={DoubleSide}
          flatShading
        />
      </T.Mesh>
    </T.Group>
    <T.Mesh
      position={[0.05, 0.035, CRAG.radius + 0.22]}
      rotation.y={0.2}
      castShadow
      receiveShadow
    >
      <T.BoxGeometry args={[0.5, 0.07, 0.34]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.crashPad} flatShading />
    </T.Mesh>
  </T.Group>

  <T.Mesh geometry={riverGeometry} scale.y={RIVER_FLATTEN} receiveShadow>
    <T.MeshStandardMaterial
      color={SCENE_COLORS.water}
      emissive={SCENE_COLORS.water}
      emissiveIntensity={0.25}
      roughness={0.25}
      flatShading
    />
  </T.Mesh>
  <!-- The spring the stream starts from, and the fall where it drops off the island. -->
  <T.Mesh position={[springX, 0.02, springZ]} scale.y={0.12}>
    <T.CylinderGeometry args={[0.32, 0.32, 0.4, 9]} />
    <T.MeshStandardMaterial
      color={SCENE_COLORS.water}
      emissive={SCENE_COLORS.water}
      emissiveIntensity={0.25}
      roughness={0.25}
      flatShading
    />
  </T.Mesh>
  <T.Mesh
    position={[riverMouthX, -WATERFALL_HEIGHT / 2 + 0.03, riverMouthZ]}
    rotation.y={-0.2}
  >
    <T.BoxGeometry args={[RIVER_HALF_WIDTH * 1.6, WATERFALL_HEIGHT, 0.05]} />
    <T.MeshStandardMaterial
      color={SCENE_COLORS.water}
      emissive={SCENE_COLORS.water}
      emissiveIntensity={0.35}
      roughness={0.25}
      transparent
      opacity={0.85}
      flatShading
    />
  </T.Mesh>

  <!-- A bike parked by the cottage door: two wheels and a diamond frame. -->
  <T.Group position={[-1.55, 0, 1.5]} rotation.y={0.35}>
    {#each [BIKE_POINTS.rearHub, BIKE_POINTS.frontHub] as [x, y], i (i)}
      <T.Mesh position={[x, y, 0]} castShadow>
        <T.TorusGeometry args={[WHEEL_RADIUS - 0.012, 0.018, 5, 14]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.tyre} flatShading />
      </T.Mesh>
    {/each}
    {#each BIKE_FRAME as tube, i (i)}
      <T.Mesh
        position={[tube.center[0], tube.center[1], 0]}
        rotation.z={tube.rotationZ}
        castShadow
      >
        <T.CylinderGeometry args={[0.011, 0.011, tube.length, 5]} />
        <T.MeshStandardMaterial color={SCENE_COLORS.bike} flatShading />
      </T.Mesh>
    {/each}
    <T.Mesh
      position={[BIKE_POINTS.saddle[0] - 0.01, BIKE_POINTS.saddle[1] + 0.02, 0]}
    >
      <T.BoxGeometry args={[0.09, 0.02, 0.04]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.tyre} flatShading />
    </T.Mesh>
    <T.Mesh
      position={[BIKE_POINTS.head[0] + 0.01, BIKE_POINTS.head[1] + 0.04, 0]}
      rotation.x={Math.PI / 2}
    >
      <T.CylinderGeometry args={[0.01, 0.01, 0.16, 5]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.tyre} flatShading />
    </T.Mesh>
  </T.Group>

  <!-- The cottage: a box, a four-sided cone for the roof, and one lit window. -->
  <T.Group position={[-0.9, 0, 0.7]} rotation.y={0.5}>
    <T.Mesh position.y={0.35} castShadow receiveShadow>
      <T.BoxGeometry args={[0.9, 0.7, 0.8]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.wall} flatShading />
    </T.Mesh>
    <T.Mesh position.y={0.95} rotation.y={Math.PI / 4} castShadow>
      <T.ConeGeometry args={[0.78, 0.55, 4]} />
      <T.MeshStandardMaterial color={SCENE_COLORS.roof} flatShading />
    </T.Mesh>
    <T.Mesh position={[0, 0.38, 0.401]}>
      <T.PlaneGeometry args={[0.24, 0.24]} />
      <T.MeshStandardMaterial
        color={SCENE_COLORS.window}
        emissive={SCENE_COLORS.window}
        emissiveIntensity={1.6}
      />
    </T.Mesh>
  </T.Group>
</T.Group>
