/**
 * The engraved globe (DESIGN-SPEC 6.8). W3-globe. Loaded lazily by loader.ts on About only.
 * Line-work on a white page: Hairline graticule, Graphite coast at 40%, Sapphire arcs and ring nodes.
 * An invisible occluder sphere writes depth only, so the far side of every line is hidden.
 * Scroll scrubs the rotation from India (78°E, 20°N) to the Netherlands (5°E, 45°N) and draws the
 * seven arcs in brief order (no chronology implied, C-13). Rendering is on demand only: inside
 * setProgress and on resize. There is no rAF loop and no pointer interaction.
 */
import {
  WebGLRenderer, Scene, OrthographicCamera, Group, BufferGeometry, Float32BufferAttribute, LineSegments, Line,
  LineBasicMaterial, Mesh, SphereGeometry, MeshBasicMaterial, Vector3, Sprite, SpriteMaterial, CanvasTexture,
} from 'three';
import type { gsap as GSAP } from 'gsap';
import coast from '@/data/globe/coast.json';
import { places } from '@/data/places';

export interface GlobeHandle { destroy: () => void }
interface MountOptions {
  section: HTMLElement;
  mount: HTMLElement;
  gsap: typeof GSAP;
  onLost?: () => void;
}

const DEG = Math.PI / 180;
const FRUSTUM = 1.15;
const C = { hairline: '#E4E0EE', graphite: '#4A5068', sapphire: '#2C509E' };
const ARC_POINTS = 64;
const RING_WORLD = 0.0613;          // ≈ 16px at a 600px globe: matches the static SVG's r=7 rings
const LABEL_FACING = 0.15;
const ROT = { y0: 78, y1: 5, x0: 20, x1: 45 };   // degrees: India-facing → Netherlands-facing

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);   // power2.inOut

/** Unit-sphere vector, spec 6.8: (cosφ·sinλ, sinφ, cosφ·cosλ). */
function vec(lat: number, lon: number, r = 1): Vector3 {
  const p = lat * DEG, l = lon * DEG;
  return new Vector3(r * Math.cos(p) * Math.sin(l), r * Math.sin(p), r * Math.cos(p) * Math.cos(l));
}

/** Polylines [[lon,lat]…][] → flat segment pairs for LineSegments. */
function segments(lines: number[][][], r = 1): number[] {
  const out: number[] = [];
  for (const line of lines) {
    for (let i = 1; i < line.length; i++) {
      const a = vec(line[i - 1][1], line[i - 1][0], r), b = vec(line[i][1], line[i][0], r);
      out.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  return out;
}

function graticuleLines(): number[][][] {
  const lines: number[][][] = [];
  for (let lon = -180; lon < 180; lon += 20) {          // 18 meridians, ±80° like the static SVG
    const m: number[][] = [];
    for (let lat = -80; lat <= 80; lat += 3) m.push([lon, lat]);
    m.push([lon, 80]);
    lines.push(m);
  }
  for (let lat = -80; lat <= 80; lat += 20) {           // 9 parallels
    const p: number[][] = [];
    for (let lon = -180; lon <= 180; lon += 3) p.push([lon, lat]);
    lines.push(p);
  }
  return lines;
}

/** Great-circle arc a→b (slerp), lifted r = 1 + 0.06·sin(πt). */
function arcPositions(a: Vector3, b: Vector3): number[] {
  const omega = Math.acos(Math.min(1, Math.max(-1, a.dot(b))));
  const so = Math.sin(omega) || 1;
  const out: number[] = [];
  for (let i = 0; i < ARC_POINTS; i++) {
    const t = i / (ARC_POINTS - 1);
    const ka = Math.sin((1 - t) * omega) / so, kb = Math.sin(t * omega) / so;
    const r = 1 + 0.06 * Math.sin(Math.PI * t);
    out.push((a.x * ka + b.x * kb) * r, (a.y * ka + b.y * kb) * r, (a.z * ka + b.z * kb) * r);
  }
  return out;
}

/** 64px ring node: White fill, 1.5px Sapphire ring, Sapphire centre dot (CSS px × 4 texels). */
function ringTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.beginPath(); g.arc(32, 32, 28, 0, Math.PI * 2);
  g.fillStyle = '#FFFFFF'; g.fill();
  g.lineWidth = 6; g.strokeStyle = C.sapphire; g.stroke();
  g.beginPath(); g.arc(32, 32, 12, 0, Math.PI * 2);
  g.fillStyle = C.sapphire; g.fill();
  const tex = new CanvasTexture(c);
  tex.colorSpace = 'srgb';
  return tex;
}

type Side = 'r' | 'l' | 't' | 'b';
// Preferred label side per place (brief order) so the four Indian places do not collide at the start.
const PREF: Side[][] = [
  ['l', 't', 'b', 'r'],   // Mundra
  ['r', 'b', 't', 'l'],   // Kakinada
  ['t', 'r', 'l', 'b'],   // Gurugram
  ['b', 'l', 'r', 't'],   // Pune
  ['r', 'b', 'l', 't'],   // Medan
  ['r', 't', 'l', 'b'],   // Odessa
  ['b', 'l', 'r', 't'],   // Balikesir
  ['t', 'r', 'l', 'b'],   // Amsterdam
];

export function mountGlobe({ section, mount, gsap, onLost }: MountOptions): GlobeHandle | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0xffffff, 0);
  const canvas = renderer.domElement;
  canvas.className = 'globe__canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  const camera = new OrthographicCamera(-FRUSTUM, FRUSTUM, FRUSTUM, -FRUSTUM, 0.1, 10);
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  const globe = new Group();
  globe.rotation.order = 'XYZ';
  scene.add(globe);

  const geometries: BufferGeometry[] = [];
  const materials: (LineBasicMaterial | MeshBasicMaterial | SpriteMaterial)[] = [];
  const track = <G extends BufferGeometry>(g: G) => (geometries.push(g), g);
  const trackM = <M extends LineBasicMaterial | MeshBasicMaterial | SpriteMaterial>(m: M) => (materials.push(m), m);

  // Occluder: depth only, drawn first.
  const occluder = new Mesh(track(new SphereGeometry(0.995, 48, 32)), trackM(new MeshBasicMaterial({ colorWrite: false })));
  occluder.renderOrder = -1;
  globe.add(occluder);

  // Limb outline (camera space, so it never rotates), as in the static SVG.
  const limb: number[] = [];
  for (let i = 0; i <= 180; i++) { const a = (i / 180) * Math.PI * 2; limb.push(Math.cos(a), Math.sin(a), 0); }
  const limbGeo = track(new BufferGeometry());
  limbGeo.setAttribute('position', new Float32BufferAttribute(limb, 3));
  scene.add(new Line(limbGeo, trackM(new LineBasicMaterial({ color: C.hairline }))));

  const gratGeo = track(new BufferGeometry());
  gratGeo.setAttribute('position', new Float32BufferAttribute(segments(graticuleLines()), 3));
  globe.add(new LineSegments(gratGeo, trackM(new LineBasicMaterial({ color: C.hairline, transparent: true, opacity: 1 }))));

  const coastGeo = track(new BufferGeometry());
  coastGeo.setAttribute('position', new Float32BufferAttribute(segments(coast as number[][][]), 3));
  globe.add(new LineSegments(coastGeo, trackM(new LineBasicMaterial({ color: C.graphite, transparent: true, opacity: 0.4 }))));

  const nodes = places.map((p) => vec(p.lat, p.lon));
  const arcMat = trackM(new LineBasicMaterial({ color: C.sapphire }));
  const arcs: BufferGeometry[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const g = track(new BufferGeometry());
    g.setAttribute('position', new Float32BufferAttribute(arcPositions(nodes[i], nodes[i + 1]), 3));
    g.setDrawRange(0, 0);
    arcs.push(g);
    const line = new Line(g, arcMat);
    line.renderOrder = 1;
    globe.add(line);
  }

  // Ring nodes: sprites drawn on top; hidden by hand when they turn away (depth would clip the quad at the limb).
  const tex = ringTexture();
  const spriteMat = trackM(new SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
  const sprites = nodes.map((n) => {
    const s = new Sprite(spriteMat);
    s.position.copy(n).multiplyScalar(1.002);
    s.scale.set(RING_WORLD, RING_WORLD, 1);
    s.renderOrder = 2;
    globe.add(s);
    return s;
  });

  // HTML labels (aria-hidden; the <ol> is the accessible equivalent).
  const labelsEl = document.createElement('div');
  labelsEl.className = 'globe__labels';
  labelsEl.setAttribute('aria-hidden', 'true');
  const labels = places.map((p) => {
    const s = document.createElement('span');
    s.className = 'globe__label';
    s.textContent = p.name;
    labelsEl.appendChild(s);
    return s;
  });

  const staticSvg = mount.querySelector<SVGElement>('.globe__static');
  mount.appendChild(canvas);
  mount.appendChild(labelsEl);

  let width = 0, height = 0, progress = -1, renders = 0, dead = false;
  let labelSize: { w: number; h: number }[] = [];
  const tmp = new Vector3();
  const camDir = new Vector3(0, 0, 1);

  function placeLabels() {
    const boxes: [number, number, number, number][] = [];
    const pts: ({ x: number; y: number } | null)[] = nodes.map((n, i) => {
      tmp.copy(n).applyMatrix4(globe.matrixWorld);
      const facing = tmp.dot(camDir);
      sprites[i].visible = facing > 0.02;
      if (facing < LABEL_FACING) return null;
      tmp.project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
    });
    // the dots themselves are obstacles
    const dotR = (RING_WORLD / (2 * FRUSTUM)) * width * 0.5 + 2;
    for (const p of pts) if (p) boxes.push([p.x - dotR, p.y - dotR, p.x + dotR, p.y + dotR]);
    const hit = (b: [number, number, number, number]) =>
      b[0] < 0 || b[1] < 0 || b[2] > width || b[3] > height ||
      boxes.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);
    const gap = dotR + 4;
    pts.forEach((p, i) => {
      const el = labels[i];
      if (!p) { el.classList.remove('is-on'); return; }
      const { w, h } = labelSize[i];
      let chosen: [number, number, number, number] | null = null;
      for (const side of PREF[i]) {
        const x = side === 'r' ? p.x + gap : side === 'l' ? p.x - gap - w : p.x - w / 2;
        const y = side === 't' ? p.y - gap - h : side === 'b' ? p.y + gap : p.y - h / 2;
        const b: [number, number, number, number] = [x, y, x + w, y + h];
        if (!hit(b)) { chosen = b; break; }
      }
      if (!chosen) { el.classList.remove('is-on'); return; }
      boxes.push(chosen);
      el.style.transform = `translate(${Math.round(chosen[0])}px, ${Math.round(chosen[1])}px)`;
      el.classList.add('is-on');
    });
  }

  function render() {
    if (dead || !width) return;
    globe.updateMatrixWorld(true);
    placeLabels();
    renderer.render(scene, camera);
    renders++;
    mount.dataset.globeRenders = String(renders);
    if (renders === 1) {
      if (renderer.getContext().isContextLost()) { fail(); return; }
      if (staticSvg) staticSvg.style.opacity = '0';           // only after the first frame succeeds
      canvas.classList.add('is-ready');
    }
  }

  function setProgress(p: number, force = false) {
    p = clamp01(p);
    if (!force && Math.abs(p - progress) < 1e-4) return;
    progress = p;
    const e = ease(p);
    globe.rotation.y = -lerp(ROT.y0, ROT.y1, e) * DEG;
    globe.rotation.x = lerp(ROT.x0, ROT.x1, e) * DEG;
    const seg = 1 / (nodes.length);          // arc i draws over [i/8, (i+1)/8]
    arcs.forEach((g, i) => g.setDrawRange(0, Math.round(clamp01((p - i * seg) / seg) * ARC_POINTS)));
    render();
  }

  function resize() {
    const r = mount.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    if (!w || !h || (w === width && h === height)) return;
    width = w; height = h;
    const aspect = w / h;
    camera.left = -FRUSTUM * Math.max(1, aspect); camera.right = FRUSTUM * Math.max(1, aspect);
    camera.top = FRUSTUM / Math.min(1, aspect); camera.bottom = -FRUSTUM / Math.min(1, aspect);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    labelSize = labels.map((l) => ({ w: l.offsetWidth, h: l.offsetHeight }));
    if (progress >= 0) render();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(mount);

  // scrub 0.8 smooths a linked animation, so the trigger drives a paused proxy tween and the
  // proxy's onUpdate renders. Ticks happen only while the scrub is catching up: idle costs nothing.
  const proxy = { p: 0 };
  const tween = gsap.to(proxy, {
    p: 1, ease: 'none', paused: true,
    onUpdate: () => setProgress(proxy.p),
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  });
  const trigger = tween.scrollTrigger!;

  const onContextLost = (e: Event) => { e.preventDefault(); fail(); };
  canvas.addEventListener('webglcontextlost', onContextLost);

  function fail() {
    destroy();
    onLost?.();
  }

  function destroy() {
    if (dead) return;
    dead = true;
    trigger.kill();
    tween.kill();
    ro.disconnect();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    tex.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    labelsEl.remove();
    if (staticSvg) staticSvg.style.opacity = '';
    delete mount.dataset.globeRenders;
  }

  resize();
  setProgress(trigger.progress, true);
  return dead ? null : { destroy };
}
