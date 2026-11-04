/**
 * Emulsion (DESIGN-SPEC v2 10.1 F3, signature move 4): a live WebGL2 field of seven metaball droplets in the pillar and
 * logo colours over Imperial, drifting, merging and splitting (Ko = together; oils and fats). The pointer stirs them
 * (repelling force, radius .25). DPR ≤ 1.5 at half resolution; renders only while on screen and not paused.
 * The caller gates: ≥ 768 + motion + WebGL2 + !saveData. Returns a disposer.
 */
const COLS = ['#2C509E', '#5B2A86', '#C8457E', '#F4C841', '#8C5B88', '#4C9BE8', '#306FE0'];
const N = COLS.length;

const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
const FS = `#version 300 es
precision highp float;
uniform vec2 u_res; uniform vec3 u_b[${N}]; uniform vec3 u_c[${N}];
out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy / u_res; uv.x *= u_res.x / u_res.y;
  float f = 0.; vec3 col = vec3(0.); float w = 0.;
  for (int i = 0; i < ${N}; i++) {
    vec2 d = uv - u_b[i].xy; float r = u_b[i].z;
    float v = r * r / max(dot(d, d), 1e-5);
    f += v; col += u_c[i] * v * v; w += v * v;
  }
  col /= max(w, 1e-5);
  float a = smoothstep(.92, 1.08, f);
  float rim = smoothstep(1.08, 1.0, f) * a;           // a lighter rim where droplets meet the field
  col = mix(col, vec3(1.), rim * .35);
  float shine = smoothstep(2.4, 6., f) * .18;          // a soft highlight in the thick of a merge
  o = vec4((col + shine) * a, a);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export default function emulsion(canvas: HTMLCanvasElement, isPaused: () => boolean, onPause: (cb: (p: boolean) => void) => () => void): () => void {
  canvas.classList.add('is-live');            // display:block first, so the canvas has a size to measure
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true, powerPreference: 'low-power' });
  const fail = () => { canvas.classList.remove('is-live'); return () => {}; };
  if (!gl) return fail();
  const sh = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fail();
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uB = gl.getUniformLocation(prog, 'u_b');
  gl.uniform3fv(gl.getUniformLocation(prog, 'u_c'), new Float32Array(COLS.flatMap(hex)));

  let aspect = 2;
  const balls = COLS.map((_, i) => ({
    x: .2 + (i / N) * 1.6, y: .25 + ((i * 37) % 10) / 20, vx: 0, vy: 0,
    r: .07 + ((i * 13) % 5) * .012, ph: i * 1.7, sp: .5 + (i % 3) * .2,
  }));
  const ptr = { x: -9, y: -9 };
  const resize = () => {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1) * .5;
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(2, Math.round(r.width * dpr));
    canvas.height = Math.max(2, Math.round(r.height * dpr));
    aspect = r.width / Math.max(1, r.height);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  const data = new Float32Array(N * 3);
  let raf = 0, on = false, t0 = performance.now(), last = t0;
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    balls.forEach((b, i) => {
      // slow Lissajous drift (≈ .04 units/s) + a spring home + pointer repulsion
      const hx = (.15 + ((i + .5) / N) * .7) * aspect + Math.sin(t * .11 * b.sp + b.ph) * .22 * aspect * .5;
      const hy = .5 + Math.cos(t * .13 * b.sp + b.ph * 1.3) * .3;
      b.vx += (hx - b.x) * .35 * dt; b.vy += (hy - b.y) * .35 * dt;
      const dx = b.x - ptr.x, dy = b.y - ptr.y, d = Math.hypot(dx, dy);
      if (d < .25) { const f = (1 - d / .25) * 2.2 * dt; b.vx += (dx / (d || 1)) * f; b.vy += (dy / (d || 1)) * f; }
      b.vx *= .96; b.vy *= .96;
      b.x += b.vx * dt * 6; b.y += b.vy * dt * 6;
      data[i * 3] = b.x; data[i * 3 + 1] = b.y; data[i * 3 + 2] = b.r * (1 + Math.sin(t * .7 + b.ph) * .08);
    });
    gl.uniform3fv(uB, data);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (on && !isPaused()) raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && on && !isPaused()) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) start(); else stop(); });
  io.observe(canvas);
  const offPause = onPause((p) => { if (p) stop(); else start(); });
  const host = canvas.closest('section') ?? canvas;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * aspect; ptr.y = 1 - (e.clientY - r.top) / r.height;
  };
  const onLeave = () => { ptr.x = ptr.y = -9; };
  host.addEventListener('pointermove', onMove as EventListener, { passive: true });
  host.addEventListener('pointerleave', onLeave);
  const ro = new ResizeObserver(() => { resize(); if (!raf) frame(performance.now()); });
  ro.observe(canvas);
  frame(performance.now());
  return () => {
    stop(); io.disconnect(); ro.disconnect(); offPause();
    host.removeEventListener('pointermove', onMove as EventListener);
    host.removeEventListener('pointerleave', onLeave);
    canvas.classList.remove('is-live');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
