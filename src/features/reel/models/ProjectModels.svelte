<script lang="ts">
  import { T, useTask, useThrelte } from "@threlte/core";
  import type { Group } from "three";
  import ProjectModel from "./ProjectModel.svelte";
  import type { ProjectModelKind } from "./projectModels";

  type Props = {
    /** Every model is drawn in turn, then copied into its `target` 2D canvas. */
    models: {
      kind: ProjectModelKind;
      seed: number;
      target: HTMLCanvasElement | undefined;
    }[];
    t: number;
    /** Width over height of every target, before any CSS transform. */
    aspect: number;
  };

  let { models, t, aspect }: Props = $props();

  const { renderer, scene, camera, renderStage, invalidate } = useThrelte();
  const groups: Group[] = $state([]);

  // Copied right after its own render, while the drawing buffer still holds that model.
  useTask(
    () => {
      const source = renderer.domElement;
      // Zero while the dialog is closed, and drawImage throws on an empty canvas.
      if (source.width === 0 || source.height === 0) return;
      for (const [i, { target }] of models.entries()) {
        const context = target?.getContext("2d");
        if (!target || !context) continue;
        for (const [j, group] of groups.entries()) group.visible = j === i;
        renderer.render(scene, camera.current);
        if (target.width !== source.width) target.width = source.width;
        if (target.height !== source.height) target.height = source.height;
        context.clearRect(0, 0, target.width, target.height);
        context.drawImage(source, 0, 0);
      }
    },
    { stage: renderStage, autoInvalidate: false },
  );

  // A target mounting after the last frame would stay blank until `t` moves.
  $effect(() => {
    for (const model of models) void model.target;
    invalidate();
  });
</script>

<!-- Manual: the aspect comes from the polaroid photo box, not from this hidden canvas. -->
<T.PerspectiveCamera
  makeDefault
  manual
  fov={30}
  {aspect}
  position={[2.7, 2.1, 3]}
  oncreate={(ref) => {
    ref.lookAt(0, 0.1, 0);
    ref.updateProjectionMatrix();
  }}
/>
<T.HemisphereLight args={["#ffe2b8", "#2a1f16", 1.2]} />
<T.DirectionalLight position={[4, 6, 5]} intensity={2.4} color="#ffd08a" />
<T.DirectionalLight position={[-5, 2, -3]} intensity={0.9} color="#ff9a4d" />

{#each models as model, i (model.seed)}
  <T.Group bind:ref={groups[i]}>
    <ProjectModel kind={model.kind} {t} seed={model.seed} />
  </T.Group>
{/each}
