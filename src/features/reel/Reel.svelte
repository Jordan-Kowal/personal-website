<script lang="ts">
  import Backdrop from "./Backdrop.svelte";
  import ExperienceScene from "./ExperienceScene.svelte";
  import IntroScene from "./IntroScene.svelte";
  import IrisWipe from "./IrisWipe.svelte";
  import OutroScene from "./OutroScene.svelte";
  import PixelDissolve from "./PixelDissolve.svelte";
  import ProjectsScene from "./ProjectsScene.svelte";
  import SkillsScene from "./SkillsScene.svelte";
  import StripeWipe from "./StripeWipe.svelte";
  import {
    END_CARD_IN_S,
    FPS,
    progress,
    SCENE_ORDER,
    SCENES,
    type Scene,
    sceneAt,
    STAGE,
    visibleScenes,
  } from "./timeline";

  let { t }: { t: number } = $props();

  const SCENE_COMPONENTS = {
    intro: IntroScene,
    skills: SkillsScene,
    experience: ExperienceScene,
    outro: OutroScene,
  } satisfies Record<Exclude<Scene, "projects">, unknown>;
  const HUD_LABELS: Record<Scene, string> = {
    intro: "PLAYER SELECT",
    skills: "INVENTORY",
    projects: "QUESTS",
    experience: "EXPERIENCE",
    outro: "CONTINUE?",
  };
  // Slow push-in on every scene, so nothing is ever perfectly still.
  const CAMERA_PUSH = 0.035;

  const scene = $derived(sceneAt(t));
  const projectsVisible = $derived(visibleScenes(t).includes("projects"));
  // Frozen outside its window, so its 3D polaroids stop re-rendering while hidden.
  const projectsT = $derived(
    Math.min(Math.max(t, SCENES.projects.start), SCENES.projects.end),
  );
  const seconds = $derived(Math.floor(t));
  const frame = $derived(Math.floor((t % 1) * FPS));
</script>

<!-- Fixed 1920×1080 stage: the player scales it, the recorder captures it as is. -->
<div
  class="grain relative overflow-hidden bg-page font-sans text-ink"
  style:width="{STAGE.width}px"
  style:height="{STAGE.height}px"
>
  <Backdrop {t} />

  <!-- Always mounted: remounting it each loop would create 8 new WebGL contexts and hit the browser's cap. -->
  <div
    class="absolute inset-0"
    style:visibility={projectsVisible ? "visible" : "hidden"}
    style:transform="scale({1 +
      CAMERA_PUSH *
        progress(projectsT, SCENES.projects.start, SCENES.projects.end)})"
  >
    <ProjectsScene t={projectsT} />
  </div>
  {#each visibleScenes(t).filter((visible) => visible !== "projects") as visible (visible)}
    {@const SceneComponent = SCENE_COMPONENTS[visible]}
    <div
      class="absolute inset-0"
      style:transform="scale({1 +
        CAMERA_PUSH * progress(t, SCENES[visible].start, SCENES[visible].end)})"
    >
      <SceneComponent {t} />
    </div>
  {/each}

  <StripeWipe {t} at={SCENES.skills.start} halfInS={0.28} />
  <IrisWipe
    {t}
    at={SCENES.projects.start}
    halfInS={0.3}
    center={{ x: 1364, y: 458 }}
  />
  <PixelDissolve {t} at={SCENES.outro.start} halfInS={0.3} />

  <!-- HUD: corner marks, labels and a progress rail that stay put while scenes change under them. -->
  <!-- The rail ends on the end card, where a single play stops; the collapse after it only serves the loop. -->
  {#each [0, 1, 2, 3] as corner (corner)}
    <span
      class="absolute font-display text-3xl leading-none text-muted"
      style:left={corner % 2 === 0 ? "28px" : "auto"}
      style:right={corner % 2 === 1 ? "28px" : "auto"}
      style:top={corner < 2 ? "20px" : "auto"}
      style:bottom={corner >= 2 ? "20px" : "auto"}>+</span
    >
  {/each}
  <div
    class="absolute top-8 right-20 left-20 flex justify-between font-display text-lg tracking-[0.3em] text-muted"
  >
    <span>JORDAN KOWAL · SHOWREEL</span>
    <span class="text-accent">
      {String(SCENE_ORDER.indexOf(scene) + 1).padStart(2, "0")} / {HUD_LABELS[
        scene
      ]}
    </span>
  </div>
  <div class="absolute right-20 bottom-8 left-20 flex items-center gap-6">
    <!-- Fixed width: Pixelify Sans has no tabular digits, so the rail would shift as the time changes. -->
    <span class="w-28 shrink-0 font-display text-lg text-muted">
      00:{String(seconds).padStart(2, "0")}.{String(frame).padStart(2, "0")}
    </span>
    <div class="relative h-1 flex-1 bg-line">
      <div
        class="h-full origin-left bg-accent"
        style:transform="scaleX({Math.min(1, t / END_CARD_IN_S)})"
      ></div>
      {#each SCENE_ORDER as marker (marker)}
        <span
          class="absolute top-1/2 size-3 -translate-1/2 rotate-45"
          style:left="{(SCENES[marker].start / END_CARD_IN_S) * 100}%"
          style:background={t >= SCENES[marker].start
            ? "var(--color-accent)"
            : "var(--color-line)"}
        ></span>
      {/each}
    </div>
    <span class="font-display text-lg tracking-[0.3em] text-muted">
      JORDANKOWAL.COM
    </span>
  </div>
</div>
