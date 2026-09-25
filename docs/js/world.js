// Builds the static world: sky, ground, trees, the house, fence, turrets, spikes and storm portals.
import * as THREE from 'three';

export const HOUSE_HALF = 5;          // half-width of the house walls
export const HOUSE_COLLIDE = 5.6;     // collision half-size (walls + foundation lip)
export const FENCE_R = 10.5;          // fence ring radius
export const FENCE_SEGS = 8;
export const SPIKE_R = 17;
export const PORTAL_R = 62;
export const WORLD_R = 88;

export function fenceIndex(x, z) {
  const step = Math.PI * 2 / FENCE_SEGS;
  let a = Math.atan2(z, x);
  if (a < 0) a += Math.PI * 2;
  return Math.round(a / step) % FENCE_SEGS;
}

function canvasTex(w, h, draw, repeat = 1) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}

function rnd(a, b) { return a + Math.random() * (b - a); }

function grassTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#5c8a3c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const l = rnd(-18, 18);
      g.fillStyle = `hsl(${rnd(80, 105)}, ${rnd(35, 50)}%, ${34 + l * 0.6}%)`;
      g.fillRect(rnd(0, w), rnd(0, h), rnd(1, 3), rnd(2, 6));
    }
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(250,240,160,${rnd(0.3, 0.7)})`;
      g.beginPath(); g.arc(rnd(0, w), rnd(0, h), rnd(0.8, 1.6), 0, 7); g.fill();
    }
  }, 60);
}

function dirtTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(140,108,72,1)');
    grd.addColorStop(0.75, 'rgba(128,100,66,0.85)');
    grd.addColorStop(1, 'rgba(128,100,66,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3000; i++) {
      const x = rnd(0, w), y = rnd(0, h);
      const d = Math.hypot(x - w / 2, y - h / 2) / (w / 2);
      if (d > 0.95) continue;
      g.fillStyle = `rgba(${rnd(70, 170)},${rnd(55, 130)},${rnd(35, 90)},${0.5 * (1 - d)})`;
      g.fillRect(x, y, rnd(1, 4), rnd(1, 4));
    }
  });
}

function pathTex() {
  return canvasTex(64, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, 0);
    grd.addColorStop(0, 'rgba(120,95,62,0)');
    grd.addColorStop(0.25, 'rgba(120,95,62,0.85)');
    grd.addColorStop(0.75, 'rgba(120,95,62,0.85)');
    grd.addColorStop(1, 'rgba(120,95,62,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 500; i++) {
      const x = rnd(w * 0.2, w * 0.8);
      g.fillStyle = `rgba(${rnd(60, 150)},${rnd(50, 110)},${rnd(30, 70)},0.5)`;
      g.fillRect(x, rnd(0, h), rnd(1, 3), rnd(1, 3));
    }
  });
}

function plankTex(base, dark) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const y = r * h / rows;
      g.fillStyle = `rgba(0,0,0,${rnd(0, 0.12)})`; g.fillRect(0, y, w, h / rows);
      for (let i = 0; i < 40; i++) {
        g.fillStyle = `rgba(0,0,0,${rnd(0.03, 0.1)})`;
        g.fillRect(rnd(0, w), y + rnd(2, h / rows - 2), rnd(20, 80), 1);
      }
      g.fillStyle = dark; g.fillRect(0, y, w, 3);
      const off = rnd(0, w);
      g.fillRect(off, y, 3, h / rows);
    }
  });
}

function brickTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#6b5a4c'; g.fillRect(0, 0, w, h);
    const bh = 32, bw = 64;
    for (let r = 0; r < h / bh; r++) {
      for (let c = -1; c < w / bw + 1; c++) {
        const x = c * bw + (r % 2 ? bw / 2 : 0);
        g.fillStyle = `hsl(${rnd(8, 18)}, ${rnd(40, 55)}%, ${rnd(34, 44)}%)`;
        g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      }
    }
  });
}

function stoneTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#4a4e57'; g.fillRect(0, 0, w, h);
    const bh = 42;
    for (let r = 0; r < h / bh + 1; r++) {
      let x = -rnd(0, 40);
      while (x < w) {
        const bw = rnd(50, 90);
        const l = rnd(46, 62);
        g.fillStyle = `hsl(220, 8%, ${l}%)`;
        g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
        g.fillStyle = 'rgba(255,255,255,0.08)';
        g.fillRect(x + 3, r * bh + 3, bw - 6, 4);
        x += bw;
      }
    }
  });
}

function metalTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#6d7680'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = `rgba(255,255,255,${rnd(0, 0.05)})`;
      g.fillRect(rnd(0, w), rnd(0, h), rnd(10, 60), 1);
    }
    for (let y = 0; y < h; y += 64) {
      g.fillStyle = '#4a525b'; g.fillRect(0, y, w, 4);
      for (let x = 8; x < w; x += 32) {
        g.fillStyle = '#99a3ad'; g.beginPath(); g.arc(x, y + 12, 3, 0, 7); g.fill();
      }
    }
  });
}

function roofTex() {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#7a2e2a'; g.fillRect(0, 0, w, h);
    const rh = 24, tw = 32;
    for (let r = 0; r < h / rh; r++) {
      for (let c = -1; c < w / tw + 1; c++) {
        const x = c * tw + (r % 2 ? tw / 2 : 0);
        g.fillStyle = `hsl(${rnd(2, 10)}, ${rnd(45, 55)}%, ${rnd(28, 38)}%)`;
        g.beginPath();
        g.roundRect(x + 1, r * rh, tw - 2, rh + 4, [0, 0, 8, 8]);
        g.fill();
      }
    }
  });
}

export function makeBlobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(0,0,0,0.55)');
  grd.addColorStop(0.6, 'rgba(0,0,0,0.3)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const PORTAL_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const PORTAL_FRAG = `
uniform float time; uniform float power; varying vec2 vUv;
void main(){
  vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
  float swirl = sin(a * 5.0 + r * 12.0 - time * 4.0) * 0.5 + 0.5;
  float swirl2 = sin(a * 3.0 - r * 8.0 + time * 2.5) * 0.5 + 0.5;
  vec3 c1 = vec3(0.45, 0.1, 0.85), c2 = vec3(0.95, 0.35, 1.0), c3 = vec3(0.05, 0.0, 0.15);
  vec3 col = mix(c3, mix(c1, c2, swirl), (1.0 - r) * 0.6 + swirl2 * 0.4);
  col += vec3(1.0, 0.8, 1.0) * pow(1.0 - r, 4.0) * 0.8;
  float alpha = smoothstep(1.0, 0.85, r);
  gl_FragColor = vec4(col * (0.3 + 0.7 * power), alpha * (0.35 + 0.65 * power));
}`;

const SKY_VERT = `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const SKY_FRAG = `
varying vec3 vPos; uniform vec3 top; uniform vec3 mid; uniform vec3 horizon;
void main(){
  float h = normalize(vPos).y;
  vec3 c = mix(horizon, mid, smoothstep(-0.02, 0.18, h));
  c = mix(c, top, smoothstep(0.18, 0.7, h));
  gl_FragColor = vec4(c, 1.0);
}`;

export function buildWorld(scene, opts) {
  const W = { obstacles: [], portals: [], fence: [], turrets: [], spikePatches: [], time: 0 };

  // Sky & fog
  const horizon = new THREE.Color(0xe99a7e), mid = new THREE.Color(0x8a6aa8), top = new THREE.Color(0x251c4a);
  scene.fog = new THREE.Fog(0xb487a0, 45, 175);
  scene.background = new THREE.Color(0xb487a0);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 24, 12), new THREE.ShaderMaterial({
    uniforms: { top: { value: top }, mid: { value: mid }, horizon: { value: horizon } },
    vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false,
  }));
  sky.renderOrder = -1;
  scene.add(sky);

  // Lights
  scene.add(new THREE.HemisphereLight(0xcfd8ff, 0x4a5a36, 1.35));
  const sun = new THREE.DirectionalLight(0xffd9b0, 2.4);
  sun.position.set(40, 60, 25);
  scene.add(sun);
  if (opts.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    const s = 26;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 10, far: 150 });
    sun.shadow.bias = -0.0008;
  }
  W.sun = sun;

  // Ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), new THREE.MeshLambertMaterial({ map: grassTex() }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = !!opts.shadows;
  scene.add(ground);

  const dirt = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), new THREE.MeshLambertMaterial({ map: dirtTex(), transparent: true, depthWrite: false }));
  dirt.rotation.x = -Math.PI / 2; dirt.position.y = 0.02;
  dirt.receiveShadow = !!opts.shadows;
  scene.add(dirt);

  // Distant mountains
  const mtnMat = new THREE.MeshLambertMaterial({ color: 0x5a4a78, flatShading: true });
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + rnd(-0.1, 0.1);
    const r = rnd(170, 210);
    const h = rnd(35, 80);
    const m = new THREE.Mesh(new THREE.ConeGeometry(rnd(30, 50), h, 5), mtnMat);
    m.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r);
    m.rotation.y = rnd(0, 3);
    scene.add(m);
  }

  // Portals + lanes
  const pTex = pathTex();
  const portalAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x3a2256, emissive: 0x9b4dff, emissiveIntensity: 1.2, roughness: 0.4, metalness: 0.3 });
  const stoneMat = new THREE.MeshLambertMaterial({ color: 0x3d3a48, flatShading: true });
  const glowTex = makeBlobTexture();
  portalAngles.forEach((a, i) => {
    const pos = new THREE.Vector3(Math.cos(a) * PORTAL_R, 0, Math.sin(a) * PORTAL_R);
    const g = new THREE.Group();
    g.position.copy(pos);
    g.rotation.y = -a + Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.38, 10, 32), ringMat.clone());
    ring.position.y = 3.8;
    g.add(ring);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(3.1, 40), new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, power: { value: 0 } }, vertexShader: PORTAL_VERT, fragmentShader: PORTAL_FRAG,
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
    }));
    disc.position.y = 3.8;
    g.add(disc);
    for (let s = -1; s <= 1; s += 2) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 2.2, 6), stoneMat);
      pillar.position.set(s * 3.4, 1.1, 0);
      g.add(pillar);
    }
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshBasicMaterial({ map: glowTex, color: 0xb070ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.05;
    g.add(glow);
    scene.add(g);
    // lane
    const laneLen = PORTAL_R - 12;
    const lane = new THREE.Mesh(new THREE.PlaneGeometry(5, laneLen), new THREE.MeshLambertMaterial({ map: pTex, transparent: true, depthWrite: false }));
    lane.material.map = pTex.clone(); lane.material.map.needsUpdate = true;
    lane.material.map.repeat.set(1, laneLen / 10);
    lane.rotation.x = -Math.PI / 2;
    lane.rotation.z = -a - Math.PI / 2;
    const mid2 = (PORTAL_R + 12) / 2;
    lane.position.set(Math.cos(a) * mid2, 0.015, Math.sin(a) * mid2);
    scene.add(lane);
    W.portals.push({ angle: a, pos, group: g, ring, disc, glow, power: 0, active: false });
    W.obstacles.push({ x: pos.x + Math.cos(a + Math.PI / 2) * 3.4, z: pos.z + Math.sin(a + Math.PI / 2) * 3.4, r: 0.9 });
    W.obstacles.push({ x: pos.x - Math.cos(a + Math.PI / 2) * 3.4, z: pos.z - Math.sin(a + Math.PI / 2) * 3.4, r: 0.9 });
  });

  // Trees (instanced)
  const treeCount = opts.low ? 55 : 85;
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.35, 2.2, 6); trunkGeo.translate(0, 1.1, 0);
  const leafGeo1 = new THREE.ConeGeometry(1.8, 3.2, 7); leafGeo1.translate(0, 3.4, 0);
  const leafGeo2 = new THREE.ConeGeometry(1.3, 2.6, 7); leafGeo2.translate(0, 4.9, 0);
  const trunks = new THREE.InstancedMesh(trunkGeo, new THREE.MeshLambertMaterial({ color: 0x6b4a2e }), treeCount);
  const leafMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
  const leaves1 = new THREE.InstancedMesh(leafGeo1, leafMat, treeCount);
  const leaves2 = new THREE.InstancedMesh(leafGeo2, leafMat, treeCount);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color();
  let placed = 0, guard = 0;
  while (placed < treeCount && guard++ < 5000) {
    const a = rnd(0, Math.PI * 2), r = rnd(24, 110);
    const laneBlock = portalAngles.some(pa => {
      let d = Math.abs(((a - pa + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      return d * r < 6 && r < PORTAL_R + 8;
    });
    if (laneBlock) continue;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (W.obstacles.some(o => Math.hypot(o.x - x, o.z - z) < 3.5)) continue;
    const s = rnd(0.8, 1.5);
    p.set(x, 0, z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd(0, 6)); sc.set(s, s * rnd(0.9, 1.2), s);
    m4.compose(p, q, sc);
    trunks.setMatrixAt(placed, m4); leaves1.setMatrixAt(placed, m4); leaves2.setMatrixAt(placed, m4);
    col.setHSL(rnd(0.26, 0.36), rnd(0.35, 0.55), rnd(0.22, 0.33));
    leaves1.setColorAt(placed, col); leaves2.setColorAt(placed, col.offsetHSL(0, 0, 0.04));
    if (r < WORLD_R + 5) W.obstacles.push({ x, z, r: 0.5 * s });
    placed++;
  }
  trunks.count = leaves1.count = leaves2.count = placed;
  [trunks, leaves1, leaves2].forEach(m => { m.castShadow = !!opts.shadows; scene.add(m); });

  // Rocks
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rocks = new THREE.InstancedMesh(rockGeo, new THREE.MeshLambertMaterial({ color: 0x8a8794, flatShading: true }), 40);
  let rc = 0; guard = 0;
  while (rc < 40 && guard++ < 2000) {
    const a = rnd(0, Math.PI * 2), r = rnd(22, 100);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const laneBlock = portalAngles.some(pa => Math.abs(((a - pa + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * r < 5 && r < PORTAL_R + 8);
    if (laneBlock) continue;
    if (W.obstacles.some(o => Math.hypot(o.x - x, o.z - z) < 2.5)) continue;
    const s = rnd(0.4, 1.3);
    p.set(x, s * 0.3, z); q.setFromEuler(new THREE.Euler(rnd(0, 3), rnd(0, 3), rnd(0, 3))); sc.set(s * rnd(1, 1.6), s, s * rnd(1, 1.4));
    m4.compose(p, q, sc);
    rocks.setMatrixAt(rc++, m4);
    if (s > 0.7 && r < WORLD_R + 5) W.obstacles.push({ x, z, r: s * 1.1 });
  }
  rocks.count = rc;
  scene.add(rocks);

  buildHouse(scene, W, opts);
  buildFence(scene, W);
  buildTurrets(scene, W);
  buildSpikes(scene, W);

  W.update = (dt) => {
    W.time += dt;
    for (const pt of W.portals) {
      const target = pt.active ? 1 : 0.12;
      pt.power += (target - pt.power) * Math.min(1, dt * 2);
      pt.disc.material.uniforms.time.value = W.time;
      pt.disc.material.uniforms.power.value = pt.power;
      pt.ring.material.emissiveIntensity = 0.2 + pt.power * (1.4 + Math.sin(W.time * 3) * 0.3);
      pt.glow.material.opacity = pt.power * 0.9;
      pt.disc.rotation.z = W.time * 0.3;
    }
    for (const t of W.turrets) {
      if (t.recoil > 0) { t.recoil = Math.max(0, t.recoil - dt * 6); t.barrel.position.z = 0.55 - t.recoil * 0.15; }
    }
    for (const s of W.fence) {
      if (s.shake > 0) {
        s.shake = Math.max(0, s.shake - dt * 4);
        s.group.position.x = s.baseX + (Math.random() - 0.5) * s.shake * 0.25;
        s.group.position.z = s.baseZ + (Math.random() - 0.5) * s.shake * 0.25;
      }
    }
    if (W.house.flash > 0) {
      W.house.flash = Math.max(0, W.house.flash - dt * 4);
      for (const m of W.house.flashMats) m.emissive.setRGB(W.house.flash * 0.6, 0, 0);
    }
  };

  W.setActivePortals = (n) => { W.portals.forEach((pt, i) => { pt.active = i < n; }); };

  return W;
}

function buildHouse(scene, W, opts) {
  const H = { group: new THREE.Group(), flash: 0, tier: -1 };
  const g = H.group;
  const texs = { wood: plankTex('#9a6b43', '#5a3a22'), brick: brickTex(), stone: stoneTex(), metal: metalTex() };
  const wallH = 4.2, base = 0.45, hw = HOUSE_HALF;

  const found = new THREE.Mesh(new THREE.BoxGeometry(hw * 2 + 0.8, base, hw * 2 + 0.8), new THREE.MeshLambertMaterial({ map: stoneTex() }));
  found.material.map.repeat.set(3, 0.3);
  found.position.y = base / 2;
  g.add(found);

  const wallMat = new THREE.MeshLambertMaterial({ map: texs.wood });
  const walls = new THREE.Mesh(new THREE.BoxGeometry(hw * 2, wallH, hw * 2), wallMat);
  walls.position.y = base + wallH / 2;
  g.add(walls);
  H.wallMat = wallMat;

  // Roof prism
  const rw = hw + 0.9, rh = 3.4;
  const shape = new THREE.Shape();
  shape.moveTo(-rw, 0); shape.lineTo(rw, 0); shape.lineTo(0, rh); shape.lineTo(-rw, 0);
  const roofGeo = new THREE.ExtrudeGeometry(shape, { depth: hw * 2 + 1.8, bevelEnabled: false });
  roofGeo.translate(0, 0, -(hw + 0.9));
  const rt = roofTex(); rt.repeat.set(0.25, 0.25);
  const roofMat = new THREE.MeshLambertMaterial({ map: rt });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = base + wallH;
  g.add(roof);
  H.roofMat = roofMat;

  // Chimney
  const chim = new THREE.Mesh(new THREE.BoxGeometry(1, 2.6, 1), new THREE.MeshLambertMaterial({ map: brickTex() }));
  chim.position.set(2.4, base + wallH + 2.5, -1.5);
  g.add(chim);
  H.chimneyTop = new THREE.Vector3(2.4, base + wallH + 4, -1.5);

  // Door and windows
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x4a2c18 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.9, 0.2), doorMat);
  door.position.set(0, base + 1.45, hw + 0.05);
  g.add(door);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffd060, metalness: 0.8, roughness: 0.3 }));
  knob.position.set(0.6, base + 1.4, hw + 0.18);
  g.add(knob);
  const winMat = new THREE.MeshStandardMaterial({ color: 0xffd98a, emissive: 0xffb347, emissiveIntensity: 0.9 });
  const frameMat = new THREE.MeshLambertMaterial({ color: 0xf2e6d0 });
  const addWindow = (x, z, ry) => {
    const w = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 0.1), winMat);
    const f1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.16), frameMat); f1.position.y = 0.66;
    const f2 = f1.clone(); f2.position.y = -0.66;
    const f3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.14), frameMat);
    const f4 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.14), frameMat);
    w.add(glass, f1, f2, f3, f4);
    w.position.set(x, base + 2.4, z);
    w.rotation.y = ry;
    g.add(w);
  };
  addWindow(-2.8, hw + 0.05, 0); addWindow(2.8, hw + 0.05, 0);
  addWindow(-1.8, -hw - 0.05, 0); addWindow(1.8, -hw - 0.05, 0);
  addWindow(hw + 0.05, -1.5, Math.PI / 2); addWindow(hw + 0.05, 1.5, Math.PI / 2);
  addWindow(-hw - 0.05, -1.5, Math.PI / 2); addWindow(-hw - 0.05, 1.5, Math.PI / 2);

  // Corner beams / plating (vary with tier)
  const beamMat = new THREE.MeshLambertMaterial({ color: 0x5a3a22 });
  H.beamMat = beamMat;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, wallH + 0.1, 0.5), beamMat);
    b.position.set(sx * hw, base + wallH / 2, sz * hw);
    g.add(b);
  }
  const plateMat = new THREE.MeshStandardMaterial({ map: texs.metal, metalness: 0.6, roughness: 0.5 });
  const plates = new THREE.Mesh(new THREE.BoxGeometry(hw * 2 + 0.3, 1.2, hw * 2 + 0.3), plateMat);
  plates.position.y = base + 0.6;
  g.add(plates);
  H.plates = plates;
  const ridgeSpikes = new THREE.Group();
  const spikeMat = new THREE.MeshStandardMaterial({ color: 0x9aa4ae, metalness: 0.8, roughness: 0.3 });
  for (let i = -4; i <= 4; i++) {
    const s = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 6), spikeMat);
    s.position.set(0, base + wallH + rh + 0.35, i * 1.25);
    ridgeSpikes.add(s);
  }
  g.add(ridgeSpikes);
  H.ridgeSpikes = ridgeSpikes;

  // Porch crates + lanterns for charm
  const crateMat = new THREE.MeshLambertMaterial({ map: plankTex('#b0824f', '#6a4a2a') });
  [[3.6, 7.2, 0.9], [4.6, 7.5, 0.7], [-7.2, -3.5, 1]].forEach(([x, z, s]) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), crateMat);
    c.position.set(x, s / 2, z); c.rotation.y = rnd(0, 1);
    g.add(c);
  });

  g.traverse(o => { if (o.isMesh) { o.castShadow = !!opts.shadows; o.receiveShadow = !!opts.shadows; } });
  scene.add(g);

  H.flashMats = [wallMat, roofMat, beamMat];
  H.setTier = (t) => {
    if (t === H.tier) return;
    H.tier = t;
    wallMat.map = [texs.wood, texs.brick, texs.stone, texs.metal][t];
    wallMat.map.repeat.set(2, 1.2);
    wallMat.needsUpdate = true;
    beamMat.color.setHex([0x5a3a22, 0x7b7f86, 0x4b5058, 0x2f353d][t]);
    roofMat.color.setHex([0xffffff, 0xe0e0ff, 0xb0b8d0, 0x8a96b0][t]);
    plates.visible = t >= 2;
    ridgeSpikes.visible = t >= 3;
  };
  H.setTier(0);
  W.house = H;
}

function buildFence(scene, W) {
  const woodTex = plankTex('#a37447', '#5e3f22');
  woodTex.repeat.set(2, 0.5);
  const postMat = new THREE.MeshLambertMaterial({ color: 0x5e3f22 });
  const chord = 2 * FENCE_R * Math.sin(Math.PI / FENCE_SEGS) * 0.97;
  for (let i = 0; i < FENCE_SEGS; i++) {
    const a = i * (Math.PI * 2 / FENCE_SEGS);
    const g = new THREE.Group();
    const cx = Math.cos(a) * FENCE_R * Math.cos(Math.PI / FENCE_SEGS), cz = Math.sin(a) * FENCE_R * Math.cos(Math.PI / FENCE_SEGS);
    g.position.set(cx, 0, cz);
    g.rotation.y = -a + Math.PI / 2;
    const mat = new THREE.MeshLambertMaterial({ map: woodTex });
    // Palisade of pointed stakes
    const n = 11;
    const stakeGeo = new THREE.CylinderGeometry(0.2, 0.22, 1.1, 6); stakeGeo.translate(0, 0.55, 0);
    const tipGeo = new THREE.ConeGeometry(0.21, 0.4, 6); tipGeo.translate(0, 1.3, 0);
    for (let k = 0; k < n; k++) {
      const x = -chord / 2 + (k + 0.5) * chord / n;
      const h = 0.9 + Math.random() * 0.2;
      const s = new THREE.Mesh(stakeGeo, mat); s.position.x = x; s.scale.y = h;
      const tp = new THREE.Mesh(tipGeo, mat); tp.position.x = x; tp.scale.y = h;
      g.add(s, tp);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(chord, 0.22, 0.12), postMat);
    rail.position.set(0, 0.85, 0.26);
    const rail2 = rail.clone(); rail2.position.y = 0.35;
    const band = new THREE.Mesh(new THREE.BoxGeometry(chord, 0.3, 0.5), new THREE.MeshStandardMaterial({ color: 0x7c8690, metalness: 0.7, roughness: 0.4 }));
    band.position.y = 0.6;
    g.add(rail, rail2, band);
    g.visible = false;
    scene.add(g);
    W.fence.push({ index: i, group: g, mat, band, hp: 0, max: 0, alive: false, shake: 0, baseX: cx, baseZ: cz, angle: a });
  }
  W.setFence = (level, hp) => {
    for (const s of W.fence) {
      s.alive = level > 0; s.hp = hp; s.max = hp;
      s.group.visible = s.alive;
      s.group.scale.y = 1;
      s.group.position.set(s.baseX, 0, s.baseZ);
      s.band.visible = level >= 5;
      s.mat.color.setHex(level >= 9 ? 0x9fa8c0 : 0xffffff);
    }
  };
}

function buildTurrets(scene, W) {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x3a4250, metalness: 0.6, roughness: 0.4 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0x5b6573, metalness: 0.5, roughness: 0.4 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x3cc8ff, emissive: 0x1a8ab8, emissiveIntensity: 1 });
  const corners = [[1, 1], [-1, -1], [1, -1], [-1, 1]];
  corners.forEach(([sx, sz]) => {
    const g = new THREE.Group();
    g.position.set(sx * (HOUSE_HALF + 0.1), 0, sz * (HOUSE_HALF + 0.1));
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5.6, 0.8), baseMat);
    pillar.position.y = 2.8;
    const head = new THREE.Group();
    head.position.y = 6;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), headMat);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.8), headMat);
    box.position.y = 0.15;
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.05), accent);
    eye.position.set(0, 0.25, 0.41);
    const barrel = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.0, 8), baseMat);
    b1.rotation.x = Math.PI / 2; b1.position.set(0.14, 0, 0);
    const b2 = b1.clone(); b2.position.x = -0.14;
    barrel.add(b1, b2);
    barrel.position.set(0, 0.2, 0.55);
    const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0, 0.55);
    barrel.add(muzzle);
    head.add(dome, box, eye, barrel);
    g.add(pillar, head);
    g.visible = false;
    scene.add(g);
    W.turrets.push({ group: g, head, barrel, muzzle, cooldown: Math.random() * 0.3, recoil: 0, active: false, target: null });
  });
  W.setTurrets = (n) => W.turrets.forEach((t, i) => { t.active = i < n; t.group.visible = t.active; });
}

function buildSpikes(scene, W) {
  const perPatch = 22;
  const count = 8 * perPatch;
  const geo = new THREE.ConeGeometry(0.12, 0.6, 5); geo.translate(0, 0.3, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0xe4ebf2, metalness: 0.45, roughness: 0.3 });
  const inst = new THREE.InstancedMesh(geo, mat, count);
  const plateMat = new THREE.MeshLambertMaterial({ color: 0x6b5a48 });
  const m4 = new THREE.Matrix4();
  const group = new THREE.Group();
  let k = 0;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + Math.PI / 4;
    const cx = Math.cos(a) * SPIKE_R, cz = Math.sin(a) * SPIKE_R;
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.4, 0.12, 20), plateMat);
    plate.position.set(cx, 0.06, cz);
    group.add(plate);
    for (let j = 0; j < perPatch; j++) {
      const rr = Math.sqrt(Math.random()) * 2.0, aa = Math.random() * Math.PI * 2;
      m4.makeTranslation(cx + Math.cos(aa) * rr, 0.1, cz + Math.sin(aa) * rr);
      inst.setMatrixAt(k++, m4);
    }
    W.spikePatches.push({ x: cx, z: cz, r: 2.4 });
  }
  group.add(inst);
  group.visible = false;
  scene.add(group);
  W.setSpikes = (level) => { group.visible = level > 0; };
}
