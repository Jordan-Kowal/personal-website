import {
  type BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Shape,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { GlyphNode, SkillIcon } from "../icons";

const VIEWBOX_SIZE = 24;
const LOGO_DEPTH = 3;
const LOGO_CURVE_SEGMENTS = 10;
// The filling sits just behind the logo's face, so the cut-outs read as inlaid in another colour.
const INLAY_DEPTH = 3;
// Lucide strokes are 2 units wide: a tube of radius 1 keeps the icon's weight.
const STROKE_RADIUS = 1;
const MIN_POINT_GAP = 0.01;

const toSvg = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;

const toElement = ([tag, attributes]: GlyphNode) => {
  const attributeText = Object.entries(attributes)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
  return `<${tag} ${attributeText} fill="none" stroke="black" stroke-width="2"/>`;
};

const logoShapes = (path: string) =>
  new SVGLoader()
    .parse(toSvg(`<path d="${path}"/>`))
    .paths.flatMap((shapePath) => shapePath.toShapes());

const logoGeometry = (shapes: Shape[]) =>
  new ExtrudeGeometry(shapes, {
    depth: LOGO_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.35,
    bevelSegments: 2,
    curveSegments: LOGO_CURVE_SEGMENTS,
  });

// The holed shapes' outlines, filled: what shows through the letters cut out of CSS or HTML5.
const inlayGeometry = (shapes: Shape[]) => {
  const plates = shapes
    .filter((shape) => shape.holes.length > 0)
    .map((shape) => new Shape(shape.getPoints(LOGO_CURVE_SEGMENTS)));
  if (plates.length === 0) return null;
  return new ExtrudeGeometry(plates, {
    depth: INLAY_DEPTH,
    bevelEnabled: false,
    curveSegments: LOGO_CURVE_SEGMENTS,
  });
};

// Each stroke becomes a tube, with a ball on both ends of open ones for Lucide's round caps.
const glyphGeometry = (nodes: GlyphNode[]) => {
  const parsed = new SVGLoader().parse(toSvg(nodes.map(toElement).join("")));
  const pieces: BufferGeometry[] = [];
  for (const shapePath of parsed.paths) {
    for (const subPath of shapePath.subPaths) {
      const points = subPath
        .getPoints(12)
        .filter(
          (point, i, all) =>
            i === 0 || point.distanceTo(all[i - 1]) > MIN_POINT_GAP,
        )
        .map((point) => new Vector3(point.x, point.y, 0));
      if (points.length < 2) continue;
      const isClosed =
        points.length > 2 &&
        points[0].distanceTo(points[points.length - 1]) < MIN_POINT_GAP * 10;
      if (isClosed) points.pop();
      // Centripetal keeps the corners of straight segments from overshooting.
      const curve = new CatmullRomCurve3(points, isClosed, "centripetal");
      pieces.push(
        new TubeGeometry(
          curve,
          Math.max(8, points.length * 6),
          STROKE_RADIUS,
          6,
          isClosed,
        ),
      );
      if (isClosed) continue;
      for (const end of [points[0], points[points.length - 1]]) {
        pieces.push(
          new SphereGeometry(STROKE_RADIUS, 8, 6).translate(end.x, end.y, 0),
        );
      }
    }
  }
  // Tubes and spheres carry the same attributes except the index, which merging needs on all or none.
  return mergeGeometries(pieces.map((piece) => piece.toNonIndexed()));
};

/**
 * A 3D model of a skill icon, centred on the origin, one unit per viewBox unit (so 24 wide).
 * `inlay` fills a logo's cut-outs, and is null when there are none (or for a glyph).
 * Browser only: SVGLoader parses with DOMParser.
 */
export const buildIconGeometry = (icon: SkillIcon) => {
  const shapes = icon.kind === "logo" ? logoShapes(icon.path) : [];
  const body =
    icon.kind === "logo" ? logoGeometry(shapes) : glyphGeometry(icon.nodes);
  const inlay = inlayGeometry(shapes);
  body.computeBoundingBox();
  const depthCentre = body.boundingBox
    ? (body.boundingBox.max.z + body.boundingBox.min.z) / 2
    : 0;
  // SVG's y axis points down: half a turn around x puts the icon upright, facing the camera.
  for (const geometry of [body, inlay]) {
    geometry
      ?.translate(-VIEWBOX_SIZE / 2, -VIEWBOX_SIZE / 2, -depthCentre)
      .rotateX(Math.PI);
  }
  return { body, inlay };
};
