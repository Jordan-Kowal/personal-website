<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import {
    type DirectionalLight,
    type Group,
    IcosahedronGeometry,
    type PerspectiveCamera,
    Raycaster,
    Vector3,
  } from "three";
  import { HOBBIES, type Hotspot } from "./hobbies";
  import Island from "./Island.svelte";
  import {
    blendAngle,
    cameraDistance,
    visibleHalfWidth,
    WIDE_ASPECT,
    wrapAround,
  } from "./islandMath";
  import { SCENE_COLORS } from "./palette";

  type Props = {
    pointer: { x: number; y: number; isInside: boolean };
    /** Where the island stands, in normalized device coordinates. */
    anchor: { x: number; y: number };
    isAnimated: boolean;
    /** 0 on the hero, 1 in the hobbies view, in between while flying from one to the other. */
    focus: number;
    /** Extra turn in the hobbies view, in radians, on top of the angle that faces every hobby. */
    turn: number;
    /** Receives every hobby's spot on screen, in `HOBBIES` order, on each frame `focus` is above 0. */
    onHotspots: (hotspots: Hotspot[]) => void;
  };

  const FOV_DEGREES = 32;
  // Raises the grass a little above the card's bottom edge, so the card stands in it.
  const ISLAND_LIFT = 0.35;
  const ISLAND_SCALE = 0.76;
  const BASE_DISTANCE = 13;
  const CAMERA_HEIGHT = 3.6;
  const CAMERA_SWAY = { x: 0.7, y: 0.45 };
  const CAMERA_FOLLOW_RATE = 2.5;
  const IDLE_SPIN_RADIANS_PER_SECOND = 0.05;
  // The hobbies view: the island centred and grown, turned so every hobby faces the camera.
  const FOCUS_YAW = 0.3;
  const FOCUS_Y = -0.9;
  const FOCUS_MAX_SCALE = 1.3;
  // Share of the visible half width the island's radius may take up: tall screens have width to spare.
  const FOCUS_WIDTH_SHARE = { wide: 0.6, tall: 0.95 };
  // The grass top's radius in Island.svelte.
  const ISLAND_RADIUS = 3.2;
  const BOB_AMPLITUDE = 0.12;
  const BOB_SPEED = 0.6;
  const CLOUD_SPEED = 0.18;
  // A cloud's half width plus the camera's sway: past this margin it is fully off screen.
  const CLOUD_MARGIN = 2.2;

  // Far back and high, so they drift above the headline rather than across it.
  const CLOUDS = [
    { x: -5, y: 1.9, z: -7, scale: 0.9 },
    { x: 2, y: 2.2, z: -9, scale: 1.3 },
    { x: 7, y: 1.6, z: -6, scale: 0.7 },
  ];
  const CLOUD_PUFFS = [
    { x: 0, y: 0, scale: 0.6 },
    { x: 0.55, y: -0.08, scale: 0.45 },
    { x: -0.5, y: -0.1, scale: 0.4 },
  ];
  const FLOATING_ROCKS = [
    { x: -3.6, y: -1.4, z: 1, scale: 0.3, phase: 0 },
    { x: 3.8, y: -2.2, z: -0.5, scale: 0.22, phase: 2 },
    { x: 2.9, y: -0.4, z: 2.4, scale: 0.16, phase: 4 },
  ];

  let { pointer, anchor, isAnimated, focus, turn, onHotspots }: Props =
    $props();

  interactivity();
  const { size, invalidate } = useThrelte();

  const puffGeometry = new IcosahedronGeometry(1, 1);
  const chunkGeometry = new IcosahedronGeometry(1, 0);

  let camera: PerspectiveCamera | undefined = $state();
  let world: Group | undefined = $state();
  let sun: DirectionalLight | undefined = $state();
  let clouds: Group[] = $state([]);
  let floatingRocks: Group[] = $state([]);
  let elapsed = 0;
  // The idle spin pauses in the hobbies view, so the way back returns to where it left off.
  let spin = 0;
  const hotspotPosition = new Vector3();
  const sightRaycaster = new Raycaster();
  const sightDirection = new Vector3();
  // A marker sits just off its prop: hits this close to it are the prop it labels, not a cover.
  const SIGHT_TOLERANCE = 0.25;

  // The island stands under the player card: `anchor` is where the card's bottom sits, projected
  // onto the plane the camera looks at.
  // `$size`, not `size.current`: only the store subscription re-runs this on resize.
  let aspect = $derived($size.width / Math.max(1, $size.height));
  let isWide = $derived(aspect >= WIDE_ASPECT);
  let distance = $derived(cameraDistance(aspect, BASE_DISTANCE));
  let halfHeight = $derived(
    Math.tan(((FOV_DEGREES / 2) * Math.PI) / 180) * distance,
  );
  let islandX = $derived(anchor.x * halfHeight * aspect);
  let islandY = $derived(anchor.y * halfHeight + ISLAND_LIFT);
  let focusScale = $derived(
    Math.min(
      FOCUS_MAX_SCALE,
      (halfHeight *
        aspect *
        (isWide ? FOCUS_WIDTH_SHARE.wide : FOCUS_WIDTH_SHARE.tall)) /
        ISLAND_RADIUS,
    ),
  );
  let groupX = $derived(islandX * (1 - focus));
  let groupY = $derived(islandY + (FOCUS_Y - islandY) * focus);
  let groupScale = $derived(ISLAND_SCALE + (focusScale - ISLAND_SCALE) * focus);

  const placeCamera = (follow: number) => {
    if (!camera) return;
    const sway = pointer.isInside ? pointer : { x: 0, y: 0 };
    const goalX = sway.x * CAMERA_SWAY.x;
    const goalY = CAMERA_HEIGHT + sway.y * CAMERA_SWAY.y;
    camera.position.x += (goalX - camera.position.x) * follow;
    camera.position.y += (goalY - camera.position.y) * follow;
    camera.position.z = distance;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
  };

  const turnWorld = () => {
    if (!world) return;
    world.rotation.y = blendAngle(spin, FOCUS_YAW + turn, focus);
  };

  const projectHotspots = () => {
    const view = camera;
    const spinning = world;
    if (!view || !spinning || focus === 0) return;
    spinning.updateWorldMatrix(true, false);
    onHotspots(
      HOBBIES.map((hobby) => {
        hotspotPosition.fromArray(hobby.anchor);
        spinning.localToWorld(hotspotPosition);
        sightDirection.subVectors(hotspotPosition, view.position);
        const reach = sightDirection.length();
        sightRaycaster.set(view.position, sightDirection.normalize());
        sightRaycaster.far = reach - SIGHT_TOLERANCE;
        const isInSight =
          sightRaycaster.intersectObject(spinning, true).length === 0;
        hotspotPosition.project(view);
        return { x: hotspotPosition.x, y: hotspotPosition.y, isInSight };
      }),
    );
  };

  const animate = (delta: number) => {
    const step = Math.min(delta, 1 / 30);
    elapsed += step;
    placeCamera(1 - Math.exp(-CAMERA_FOLLOW_RATE * step));
    if (focus === 0) spin += IDLE_SPIN_RADIANS_PER_SECOND * step;
    turnWorld();
    if (world) world.position.y = Math.sin(elapsed * BOB_SPEED) * BOB_AMPLITUDE;
    // Each cloud leaves the frame before it wraps, so it slides back in from the other side.
    clouds.forEach((cloud, i) => {
      const base = CLOUDS[i];
      const halfSpan =
        visibleHalfWidth({
          fovDegrees: FOV_DEGREES,
          depth: distance - base.z,
          aspect,
        }) +
        CLOUD_MARGIN * base.scale;
      cloud.position.x = wrapAround(base.x + elapsed * CLOUD_SPEED, halfSpan);
    });
    floatingRocks.forEach((rock, i) => {
      const base = FLOATING_ROCKS[i];
      rock.position.y = base.y + Math.sin(elapsed * 0.9 + base.phase) * 0.18;
      rock.rotation.y = elapsed * 0.3 + base.phase;
    });
    projectHotspots();
  };

  useTask(animate, { running: () => isAnimated });

  // A directional light aims at its target, which has to follow the island by hand.
  $effect(() => {
    if (!sun) return;
    sun.target.position.set(groupX, groupY, 0);
    sun.target.updateMatrixWorld();
    invalidate();
  });

  // Without the animation loop, frame the scene once where it rests.
  $effect(() => {
    if (isAnimated || !world) return;
    world.position.y = 0;
    distance;
    placeCamera(1);
    turnWorld();
    projectHotspots();
    invalidate();
  });
</script>

<T.PerspectiveCamera
  makeDefault
  bind:ref={camera}
  fov={FOV_DEGREES}
  position={[0, CAMERA_HEIGHT, distance]}
  oncreate={(ref) => ref.lookAt(0, 0, 0)}
/>

<T.Fog attach="fog" args={[SCENE_COLORS.fog, distance * 0.9, distance * 1.9]} />
<T.HemisphereLight args={[SCENE_COLORS.sky, SCENE_COLORS.ground, 1.4]} />
<!-- The sun and its shadow frustum travel with the island, which moves with the layout. -->
<T.DirectionalLight
  bind:ref={sun}
  position={[groupX + 4, groupY + 6, 3]}
  intensity={3}
  color={SCENE_COLORS.sun}
  castShadow
  shadow.mapSize={[1024, 1024]}
  shadow.camera.left={-4}
  shadow.camera.right={4}
  shadow.camera.top={4}
  shadow.camera.bottom={-4}
  shadow.bias={-0.0005}
/>
<!-- Warm rim light from behind, the low sun catching the island's edge. -->
<T.DirectionalLight
  position={[groupX - 5, groupY + 3, -6]}
  intensity={1.6}
  color="#ff9a4d"
/>

<T.Group position={[groupX, groupY, 0]} scale={groupScale}>
  <T.Group bind:ref={world}>
    <Island {pointer} {isAnimated} />
  </T.Group>

  {#each FLOATING_ROCKS as rock, i (i)}
    <T.Group
      bind:ref={floatingRocks[i]}
      position={[rock.x, rock.y, rock.z]}
      scale={rock.scale}
    >
      <T.Mesh geometry={chunkGeometry} castShadow>
        <T.MeshStandardMaterial color={SCENE_COLORS.dirtDeep} flatShading />
      </T.Mesh>
      <T.Mesh geometry={chunkGeometry} position.y={0.55} scale={[1, 0.35, 1]}>
        <T.MeshStandardMaterial color={SCENE_COLORS.grassSide} flatShading />
      </T.Mesh>
    </T.Group>
  {/each}
</T.Group>

<!-- On tall screens the headline fills the sky, so the clouds stay home. -->
{#each isWide ? CLOUDS : [] as cloud, i (i)}
  <T.Group
    bind:ref={clouds[i]}
    position={[cloud.x, cloud.y, cloud.z]}
    scale={cloud.scale}
  >
    {#each CLOUD_PUFFS as puff, j (j)}
      <T.Mesh
        geometry={puffGeometry}
        position={[puff.x, puff.y, 0]}
        scale={puff.scale}
      >
        <!-- Out of the fog, which would otherwise turn far clouds into dark rocks. -->
        <T.MeshStandardMaterial
          color={SCENE_COLORS.cloud}
          emissive={SCENE_COLORS.sun}
          emissiveIntensity={0.45}
          flatShading
          fog={false}
        />
      </T.Mesh>
    {/each}
  </T.Group>
{/each}
