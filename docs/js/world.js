// The static world: sky, storm wall, shield dome, terrain, vegetation, neighbourhood, portals and the house.
import * as THREE from 'three';
import { cloneStatic, instanceParts } from './assets.js';

export const PORTAL_R = 62;
export const WORLD_R = 88;
export const BUILD_R = 26;
export const PORTAL_ANGLES = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
export const COMPASS = ['SE', 'SW', 'NW', 'NE'];

function canvasTex(w, h, draw, repeat = 1) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);

function grassTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#5f9a3e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      const x = rnd(0, w), y = rnd(0, h), r = rnd(30, 90);
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      const l = rnd(-8, 8);
      grd.addColorStop(0, `hsla(${rnd(85, 105)}, 45%, ${38 + l}%, 0.45)`);
      grd.addColorStop(1, 'hsla(95, 45%, 40%, 0)');
      g.fillStyle = grd;
      for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) { g.save(); g.translate(ox, oy); g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }
    }
    for (let i = 0; i < 9000; i++) {
      const l = rnd(-14, 16);
      g.fillStyle = `hsla(${rnd(78, 110)}, ${rnd(40, 60)}%, ${38 + l}%, 0.9)`;
      g.fillRect(rnd(0, w), rnd(0, h), rnd(1, 2), rnd(3, 7));
    }
    for (let i = 0; i < 90; i++) {
      g.fillStyle = ['#fff6c2', '#ffd6f0', '#fff'][i % 3];
      g.beginPath(); g.arc(rnd(0, w), rnd(0, h), rnd(1, 2.2), 0, 7); g.fill();
    }
  }, 34);
}

function dirtTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, w * 0.12, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(150,118,80,1)');
    grd.addColorStop(0.7, 'rgba(140,110,74,0.85)');
    grd.addColorStop(1, 'rgba(140,110,74,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) {
      const x = rnd(0, w), y = rnd(0, h);
      const d = Math.hypot(x - w / 2, y - h / 2) / (w / 2);
      if (d > 0.95) continue;
      g.fillStyle = `rgba(${rnd(80, 180)},${rnd(65, 135)},${rnd(40, 95)},${0.5 * (1 - d)})`;
      g.fillRect(x, y, rnd(1, 4), rnd(1, 4));
    }
  });
}

function pathTex() {
  return canvasTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0);
    grd.addColorStop(0, 'rgba(126,98,64,0)');
    grd.addColorStop(0.25, 'rgba(126,98,64,0.9)');
    grd.addColorStop(0.75, 'rgba(126,98,64,0.9)');
    grd.addColorStop(1, 'rgba(126,98,64,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 600; i++) {
      g.fillStyle = `rgba(${rnd(60, 160)},${rnd(50, 120)},${rnd(30, 80)},0.5)`;
      g.fillRect(rnd(w * 0.2, w * 0.8), rnd(0, h), rnd(1, 3), rnd(1, 3));
    }
  });
}

function blobTexture(color = '0,0,0', a = 0.55) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, `rgba(${color},${a})`);
  grd.addColorStop(0.6, `rgba(${color},${a * 0.5})`);
  grd.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const SKY_VERT = `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const SKY_FRAG = `
varying vec3 vPos; uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 sunDir; uniform float time;
void main(){
  vec3 d = normalize(vPos);
  float h = d.y;
  vec3 c = mix(horizon, mid, smoothstep(-0.02, 0.22, h));
  c = mix(c, top, smoothstep(0.22, 0.85, h));
  float s = max(0.0, dot(d, normalize(sunDir)));
  s = clamp(s, 0.0, 1.0);
  c += vec3(1.0, 0.85, 0.6) * (pow(s, 600.0) * 3.0 + pow(s, 12.0) * 0.35);
  gl_FragColor = vec4(c, 1.0);
}`;

const STORM_VERT = `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const STORM_FRAG = `
uniform float time; varying vec2 vUv; varying vec3 vW;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.1; a *= 0.5; } return v; }
void main(){
  vec2 p = vec2(vUv.x * 40.0, vUv.y * 6.0);
  float n = fbm(p + vec2(time * 0.25, -time * 0.15));
  float n2 = fbm(p * 1.7 - vec2(time * 0.4, time * 0.1));
  vec3 col = mix(vec3(0.22, 0.05, 0.42), vec3(0.72, 0.3, 1.0), n * n2 * 1.6);
  float bolt = step(0.985, noise(vec2(vUv.x * 60.0, floor(time * 3.0))));
  col += vec3(0.8, 0.6, 1.0) * bolt * smoothstep(0.2, 0.8, vUv.y) * n2;
  float a = (0.55 + 0.4 * n) * smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.75, 1.0, vUv.y));
  gl_FragColor = vec4(max(col, 0.0), clamp(a, 0.0, 1.0));
}`;

const DOME_VERT = `varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){ vec4 w = modelMatrix * vec4(position,1.0); vP = position; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`;
const DOME_FRAG = `
uniform float time; uniform float hit; varying vec3 vN; varying vec3 vV; varying vec3 vP;
void main(){
  float f = pow(clamp(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0), 2.5);
  vec2 hp = vec2(atan(vP.z, vP.x) * 9.0, vP.y * 0.9);
  vec2 g = abs(fract(hp) - 0.5);
  float line = smoothstep(0.46, 0.5, max(g.x, g.y));
  float band = 0.5 + 0.5 * sin(vP.y * 0.6 - time * 1.5);
  vec3 col = mix(vec3(0.25, 0.7, 1.0), vec3(1.0, 0.35, 0.4), hit);
  float a = f * 0.55 + line * 0.08 * band + hit * 0.15 * f;
  gl_FragColor = vec4(col, clamp(a * (0.7 + 0.3 * band), 0.0, 1.0));
}`;

const PORTAL_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const PORTAL_FRAG = `
uniform float time; uniform float power; uniform float warn; varying vec2 vUv;
void main(){
  vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
  float swirl = sin(a * 5.0 + r * 12.0 - time * 4.0) * 0.5 + 0.5;
  float swirl2 = sin(a * 3.0 - r * 8.0 + time * 2.5) * 0.5 + 0.5;
  vec3 c1 = mix(vec3(0.45, 0.1, 0.85), vec3(0.95, 0.15, 0.2), warn);
  vec3 c2 = mix(vec3(0.95, 0.35, 1.0), vec3(1.0, 0.7, 0.3), warn);
  vec3 col = mix(vec3(0.05, 0.0, 0.15), mix(c1, c2, swirl), (1.0 - r) * 0.6 + swirl2 * 0.4);
  col += vec3(1.0, 0.85, 1.0) * pow(clamp(1.0 - r, 0.0, 1.0), 4.0) * 0.9;
  float alpha = smoothstep(1.0, 0.85, r);
  gl_FragColor = vec4(max(col, 0.0) * (0.35 + 0.9 * power), clamp(alpha * (0.35 + 0.65 * power), 0.0, 1.0));
}`;

const BEAM_FRAG = `
uniform float time; uniform vec3 color; uniform float amount; varying vec2 vUv;
void main(){
  float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
  float flow = 0.6 + 0.4 * sin(vUv.y * 30.0 - time * 8.0);
  float a = pow(clamp(edge, 0.0, 1.0), 2.0) * flow * (1.0 - vUv.y) * amount;
  gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
}`;

export function buildWorld(scene, opts) {
  const W = { obstacles: [], portals: [], time: 0, houseHalf: { x: 5.5, z: 4.5 }, clouds: [] };

  // ---------------- sky, fog, lights
  const sunDir = new THREE.Vector3(40, 55, 25).normalize();
  scene.fog = new THREE.Fog(0xc9a3b8, 55, 210);
  scene.background = new THREE.Color(0xc9a3b8);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color(0x3a4fa0) }, mid: { value: new THREE.Color(0x9a8fd0) }, horizon: { value: new THREE.Color(0xf5b49a) }, sunDir: { value: sunDir }, time: { value: 0 } },
    vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(450, 32, 16), skyMat);
  sky.renderOrder = -2;
  scene.add(sky);

  scene.add(new THREE.HemisphereLight(0xd6e4ff, 0x5a6a3a, 1.25));
  const sun = new THREE.DirectionalLight(0xffe2c2, 2.6);
  sun.position.copy(sunDir).multiplyScalar(60);
  scene.add(sun);
  scene.add(sun.target);
  if (opts.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(opts.shadowSize, opts.shadowSize);
    const s = 30;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 5, far: 160 });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
  }
  W.sun = sun;
  W.sunDir = sunDir;

  // ---------------- clouds (soft painted sprites)
  const cloudTex = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    for (let i = 0; i < 14; i++) {
      const x = rnd(50, 206), y = rnd(55, 85), r = rnd(22, 46);
      const grd = g.createRadialGradient(x, y - r * 0.2, 0, x, y, r);
      grd.addColorStop(0, 'rgba(255,255,255,0.95)');
      grd.addColorStop(0.6, 'rgba(255,245,250,0.6)');
      grd.addColorStop(1, 'rgba(255,240,250,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  for (let i = 0; i < 22; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, color: new THREE.Color().setHSL(rnd(0.85, 0.98), 0.4, rnd(0.82, 0.92)), transparent: true, depthWrite: false, fog: false, opacity: rnd(0.55, 0.85) }));
    const a = rnd(0, Math.PI * 2), r = rnd(90, 260);
    const w = rnd(45, 90);
    sp.scale.set(w, w * 0.45, 1);
    sp.position.set(Math.cos(a) * r, rnd(45, 95), Math.sin(a) * r);
    sp.userData.speed = rnd(0.5, 1.5);
    sp.renderOrder = -1;
    scene.add(sp);
    W.clouds.push(sp);
  }

  // ---------------- storm wall
  const stormMat = new THREE.ShaderMaterial({ uniforms: { time: { value: 0 } }, vertexShader: STORM_VERT, fragmentShader: STORM_FRAG, transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false });
  const storm = new THREE.Mesh(new THREE.CylinderGeometry(140, 130, 60, 64, 1, true), stormMat);
  storm.position.y = 24;
  storm.renderOrder = -1;
  scene.add(storm);
  W.stormMat = stormMat;

  // ---------------- ground
  const ground = new THREE.Mesh(new THREE.CircleGeometry(300, 64), new THREE.MeshLambertMaterial({ map: grassTex() }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = !!opts.shadows;
  scene.add(ground);
  W.ground = ground;
  const dirt = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ map: dirtTex(), transparent: true, depthWrite: false }));
  dirt.rotation.x = -Math.PI / 2; dirt.position.y = 0.02;
  dirt.receiveShadow = !!opts.shadows;
  scene.add(dirt);

  // ---------------- portals & lanes
  const pTex = pathTex();
  const glowTex = blobTexture('255,255,255', 1);
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0x3d3a48, flatShading: true });
  const beamGeo = new THREE.CylinderGeometry(1.2, 1.2, 70, 16, 1, true);
  beamGeo.translate(0, 35, 0);
  PORTAL_ANGLES.forEach((a, i) => {
    const pos = new THREE.Vector3(Math.cos(a) * PORTAL_R, 0, Math.sin(a) * PORTAL_R);
    const g = new THREE.Group();
    g.position.copy(pos);
    g.rotation.y = -a + Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.38, 12, 40), new THREE.MeshStandardMaterial({ color: 0x3a2256, emissive: 0x9b4dff, emissiveIntensity: 1.2, roughness: 0.4, metalness: 0.3 }));
    ring.position.y = 3.8;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(3.1, 48), new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, power: { value: 0 }, warn: { value: 0 } }, vertexShader: PORTAL_VERT, fragmentShader: PORTAL_FRAG,
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
    }));
    disc.position.y = 3.8;
    g.add(ring, disc);
    for (let s = -1; s <= 1; s += 2) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 2.2, 6), stoneMat);
      pillar.position.set(s * 3.4, 1.1, 0);
      g.add(pillar);
    }
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({ map: glowTex, color: 0xb070ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.06;
    g.add(glow);
    const beam = new THREE.Mesh(beamGeo, new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0xff3a4a) }, amount: { value: 0 } },
      vertexShader: PORTAL_VERT, fragmentShader: BEAM_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    }));
    g.add(beam);
    scene.add(g);
    // lane from portal to the base
    const laneLen = PORTAL_R - 14;
    const laneTex = pTex.clone(); laneTex.needsUpdate = true; laneTex.repeat.set(1, laneLen / 10);
    const lane = new THREE.Mesh(new THREE.PlaneGeometry(5, laneLen), new THREE.MeshLambertMaterial({ map: laneTex, transparent: true, depthWrite: false }));
    lane.rotation.x = -Math.PI / 2;
    lane.rotation.z = -a - Math.PI / 2;
    const mid = (PORTAL_R + 14) / 2;
    lane.position.set(Math.cos(a) * mid, 0.015, Math.sin(a) * mid);
    scene.add(lane);
    // warning chevrons along the lane (shown before / during a wave)
    const arrows = new THREE.Group();
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xff3b4a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    const shape = new THREE.Shape();
    shape.moveTo(-1.2, 0); shape.lineTo(0, 1.1); shape.lineTo(1.2, 0); shape.lineTo(1.2, -0.5); shape.lineTo(0, 0.6); shape.lineTo(-1.2, -0.5);
    const arrowGeo = new THREE.ShapeGeometry(shape);
    for (let k = 0; k < 9; k++) {
      const m = new THREE.Mesh(arrowGeo, arrowMat);
      const d = PORTAL_R - 6 - k * 5;
      m.position.set(Math.cos(a) * d, 0.06, Math.sin(a) * d);
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = -a - Math.PI / 2 + Math.PI;
      m.userData.k = k;
      arrows.add(m);
    }
    scene.add(arrows);
    W.portals.push({ index: i, angle: a, pos, group: g, ring, disc, glow, beam, arrows, arrowMat, power: 0, active: false, warn: 0, warnTarget: 0, compass: COMPASS[i] });
    const side = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(3.4);
    W.obstacles.push({ x: pos.x + side.x, z: pos.z + side.z, r: 0.9 });
    W.obstacles.push({ x: pos.x - side.x, z: pos.z - side.z, r: 0.9 });
  });

  const laneBlocked = (a, r, width) => PORTAL_ANGLES.some(pa => {
    const d = Math.abs(((a - pa + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    return d * r < width && r < PORTAL_R + 10;
  });

  // ---------------- neighbourhood houses
  const decor = ['house-7', 'house-18', 'house1', 'house-3', 'house-4', 'house-7', 'house-18', 'house1'];
  decor.forEach((name, i) => {
    const a = (i + 0.5) / decor.length * Math.PI * 2 + 0.2;
    const r = 40 + (i % 2) * 9;
    if (laneBlocked(a, r, 12)) return;
    const h = cloneStatic(name, { size: rnd(10, 13) });
    h.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    h.rotation.y = Math.atan2(-h.position.x, -h.position.z);
    scene.add(h);
    const d = h.userData.dims;
    W.obstacles.push({ x: h.position.x, z: h.position.z, r: Math.max(d.x, d.z) * 0.5 });
  });

  // ---------------- trees, rocks, grass (instanced)
  const placeInstanced = (name, count, heightRange, rRange, laneW, minGap, obstacleR, extra) => {
    const parts = instanceParts(name, 1);
    const meshes = parts.map(p => {
      let mat = p.material;
      if (extra?.tint) { mat = mat.clone(); mat.color.setHex(extra.tint); }
      const m = new THREE.InstancedMesh(p.geometry, mat, count);
      m.castShadow = !!opts.shadows && !!extra?.shadow;
      m.receiveShadow = !!opts.shadows;
      return m;
    });
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    let placed = 0, guard = 0;
    while (placed < count && guard++ < count * 60) {
      const a = rnd(0, Math.PI * 2), r = rnd(rRange[0], rRange[1]);
      if (laneBlocked(a, r, laneW)) continue;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (minGap && W.obstacles.some(o => Math.hypot(o.x - x, o.z - z) < o.r + minGap)) continue;
      const h = rnd(heightRange[0], heightRange[1]);
      p.set(x, 0, z);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd(0, Math.PI * 2));
      const wv = extra?.wide ? rnd(0.8, 1.4) : 1;
      s.set(h * wv, h, h * wv);
      m4.compose(p, q, s);
      for (const m of meshes) m.setMatrixAt(placed, m4);
      if (obstacleR && r < WORLD_R + 6) W.obstacles.push({ x, z, r: obstacleR * h });
      placed++;
    }
    for (const m of meshes) { m.count = placed; scene.add(m); }
  };
  placeInstanced('tree-big', opts.low ? 40 : 60, [7, 11], [30, 125], 7, 2.5, 0.05, { shadow: true });
  placeInstanced('tree-small', opts.low ? 30 : 50, [5, 8], [28, 125], 7, 2.5, 0.05, { shadow: true });
  placeInstanced('formation-large-rock', 14, [2, 4.5], [30, 110], 6, 3, 0.35, { shadow: true, wide: true });
  placeInstanced('formation-rock', 16, [1, 2.5], [24, 110], 6, 2, 0.3, { shadow: true, wide: true });
  placeInstanced('formation-stone', 12, [1, 2.2], [24, 110], 6, 2, 0.3, { shadow: true, wide: true });
  placeInstanced('grass', opts.low ? 250 : 600, [0.22, 0.45], [12, 95], 3, 0, 0, { tint: 0x9fd46a });

  // ---------------- shield dome (storm shield)
  const domeMat = new THREE.ShaderMaterial({ uniforms: { time: { value: 0 }, hit: { value: 0 } }, vertexShader: DOME_VERT, fragmentShader: DOME_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(34, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  scene.add(dome);
  W.domeMat = domeMat;

  buildHouse(scene, W, opts);

  // ---------------- per-frame animation
  W.update = (dt) => {
    W.time += dt;
    stormMat.uniforms.time.value = W.time;
    domeMat.uniforms.time.value = W.time;
    domeMat.uniforms.hit.value = Math.max(0, domeMat.uniforms.hit.value - dt * 1.5);
    for (const c of W.clouds) {
      const a = Math.atan2(c.position.z, c.position.x) + dt * 0.004 * c.userData.speed;
      const r = Math.hypot(c.position.x, c.position.z);
      c.position.x = Math.cos(a) * r; c.position.z = Math.sin(a) * r;
    }
    for (const pt of W.portals) {
      const target = pt.active ? 1 : 0.12;
      pt.power += (target - pt.power) * Math.min(1, dt * 2);
      pt.warn += (pt.warnTarget - pt.warn) * Math.min(1, dt * 5);
      const u = pt.disc.material.uniforms;
      u.time.value = W.time; u.power.value = pt.power; u.warn.value = pt.warn;
      pt.ring.material.emissive.setRGB(0.6 + pt.warn * 0.4, 0.3 * (1 - pt.warn), 1 - pt.warn * 0.8);
      pt.ring.material.emissiveIntensity = 0.2 + pt.power * (1.4 + Math.sin(W.time * 3) * 0.3) + pt.warn;
      pt.glow.material.opacity = pt.power * 0.9;
      pt.glow.material.color.setRGB(0.7 + pt.warn * 0.3, 0.45 * (1 - pt.warn * 0.6), 1 - pt.warn * 0.7);
      pt.disc.rotation.z = W.time * 0.3;
      const bu = pt.beam.material.uniforms;
      bu.time.value = W.time;
      bu.amount.value = pt.warn * (0.7 + 0.3 * Math.sin(W.time * 8));
      pt.beam.visible = pt.warn > 0.02;
      const lane = pt.laneShow || 0;
      pt.arrowMat.opacity = lane * 0.85;
      pt.arrows.visible = lane > 0.01;
      if (pt.arrows.visible) {
        pt.arrows.children.forEach(m => { const k = m.userData.k; m.scale.setScalar(0.8 + 0.35 * Math.max(0, Math.sin(W.time * 5 + k * 0.7))); });
      }
    }
    const H = W.house;
    if (H.flash > 0) {
      H.flash = Math.max(0, H.flash - dt * 4);
      for (const m of H.flashMats) m.emissive.setRGB(H.flash * 0.5, 0, 0);
    }
    if (H.plates.visible) H.core.rotation.y += dt * 1.5;
  };

  W.setActivePortals = (n) => { W.portals.forEach((pt, i) => { pt.active = i < n; }); };
  W.domeHit = () => { domeMat.uniforms.hit.value = 1; };
  return W;
}

// ---------------------------------------------------------------- the house (4 visual tiers)
const TIER_MODELS = ['house-4', 'house-3', 'house-5', 'house-5'];
const TIER_WIDTH = [10, 11, 11.5, 12.5];

function buildHouse(scene, W, opts) {
  const H = { group: new THREE.Group(), flash: 0, tier: -1, flashMats: [] };
  scene.add(H.group);
  const baseMat = new THREE.MeshLambertMaterial({ color: 0x8a8f9a });
  const found = new THREE.Mesh(new THREE.BoxGeometry(1, 0.35, 1), baseMat);
  found.receiveShadow = !!opts.shadows;
  H.group.add(found);
  H.found = found;
  H.model = null;

  // tier 3 extras: armor plates + spinning shield core on the roof
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x7a8795, metalness: 0.75, roughness: 0.35 });
  const plates = new THREE.Group();
  H.plates = plates;
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x3cc8ff, emissive: 0x3cc8ff, emissiveIntensity: 2 });
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 0), coreMat);
  H.core = core;
  plates.add(core);
  H.group.add(plates);

  H.setTier = (t) => {
    if (t === H.tier) return;
    H.tier = t;
    if (H.model) H.group.remove(H.model);
    const m = cloneStatic(TIER_MODELS[t], { size: TIER_WIDTH[t] });
    const d = m.userData.dims;
    m.position.y = 0.3;
    H.model = m;
    H.group.add(m);
    H.flashMats = [];
    m.traverse(o => {
      if (o.isMesh) {
        o.material = o.material.clone();
        if (o.material.emissive) H.flashMats.push(o.material);
      }
    });
    W.houseHalf = { x: d.x / 2 + 0.35, z: d.z / 2 + 0.35 };
    W.houseHeight = d.y + 0.3;
    found.scale.set(d.x + 1.2, 1, d.z + 1.2);
    found.position.y = 0.17;
    // armor for the top tier
    plates.visible = t >= 3;
    plates.children.filter(c => c !== core).forEach(c => plates.remove(c));
    if (t >= 3) {
      for (const sx of [-1, 1]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.4, d.z + 0.6), plateMat);
        p.position.set(sx * (d.x / 2 + 0.15), 1.0, 0);
        plates.add(p);
      }
      for (const sz of [-1, 1]) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(d.x + 0.6, 1.4, 0.25), plateMat);
        p.position.set(0, 1.0, sz * (d.z / 2 + 0.15));
        plates.add(p);
      }
      core.position.set(0, d.y + 1.4, 0);
    }
    plates.traverse(o => { if (o.isMesh) o.castShadow = !!opts.shadows; });
    if (W.onHouseChange) W.onHouseChange();
  };
  W.house = H;
}
