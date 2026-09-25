# week12
bluej work

## Holdout: Defend the House (3D phone shooter)

A 3D third-person wave-defense shooter made for phones (works on desktop too), inspired by Fortnite: Save the World.
Storm husks pour out of purple portals; defend your house, collect coins, upgrade, and push to ever-higher waves.
If you (or the house) fall, you keep your coins and retry the same wave.

The game lives in [`docs/`](docs/). It is a static site with no build step.

### Play it
- **GitHub Pages:** repo Settings → Pages → Source "Deploy from a branch" → branch `main`, folder `/docs`. Open the URL on your phone (landscape). Use "Add to Home Screen" to install it fullscreen.
- **Locally:** `cd docs && python3 -m http.server 8000`, then open `http://localhost:8000` (it must be served over http, not opened as a file).

### Controls
| Phone | Desktop |
|---|---|
| Left thumb: move (floating joystick) | WASD |
| Right thumb: drag to aim | Mouse (click to lock) |
| FIRE button (drag while holding to aim) | Left click |
| Auto-fire when the crosshair is on an enemy (toggle in Settings) | — |
| Reload / Swap buttons | R / Q or mouse wheel |
| Pause button | Esc |

### Features
- 6 guns: Pistol, SMG, Shotgun, Assault Rifle, Sniper (piercing), Rocket Launcher (splash), each with Damage / Fire Rate / Magazine / Reload upgrades.
- House upgrades: Reinforced Walls (house visibly upgrades wood → brick → stone → metal), Armor, Repair Bots, Barricade ring, up to 4 Auto Turrets, Turret Power, Spike Traps.
- Hero upgrades: Vitality, Nano Heal, Agility, Coin Magnet.
- Endless waves with Husks, fast Runners, big Brutes, and a Storm King boss every 5th wave. Headshots deal bonus damage.
- Progress auto-saves in the browser. Touch aim assist, off-screen threat arrows, dynamic resolution for smooth frame rates.

Credits: robot model by Quaternius (CC0), engine three.js (MIT). See `docs/models/CREDITS.md`.
