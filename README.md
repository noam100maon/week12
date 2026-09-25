# week12
bluej work

## Holdout: Defend the House (3D phone shooter)

A 3D third-person wave-defense shooter made for phones (works on desktop too), inspired by Fortnite: Save the World.
Storm zombies and robots pour out of purple portals; defend your house, level up your heroes and guns, build defenses,
and push to ever-higher waves. Waves continue automatically; your gun, hero and pet are locked in for the run.
When you (or the house) fall, you return to the base with all coins and XP, swap gear, build, and retry that wave.
Progress (wave, coins, levels, buildings) is saved automatically.

The game lives in [`docs/`](docs/) (static site, no build step). `holdout.html` in the repo root is a single-file build
that opens straight from disk; regenerate it with `tools/build_single.sh`.

### Play it
- **GitHub Pages:** repo Settings → Pages → Source "Deploy from a branch" → branch `main`, folder `/docs`.
- **Locally:** `cd docs && python3 -m http.server 8000`, then open `http://localhost:8000`, or just open `holdout.html`.

### Controls
| Phone | Desktop |
|---|---|
| Left thumb: move (floating joystick) | WASD |
| Right thumb: drag to aim | Mouse (click to lock) |
| FIRE button (drag while holding to aim) · optional auto-fire | Left click |
| Hero ability button | E / right click |
| Reload button | R |
| Pause button | Esc |

### Features
- **Guns and heroes level up by use, 1 → 160.** Rarity climbs Common → Uncommon → Rare → Epic → Legendary → Mythic,
  the gun changes color, and every new rarity unlocks a new ability (crits, burn, freeze, chain lightning, explosive rounds,
  lifesteal, orbital strikes, multishot, chain-reaction kills...). Each gun has its own set.
- **6 heroes** (Rex, Bolt, Nova, Cyra, Doc, Skye), each with a unique active ability (grenade, overshield, dash,
  deployable turret, heal pulse, lightning), a passive and 5 rarity perks.
- **6 guns:** Pistol, SMG, Shotgun, Assault Rifle, Sniper, Rocket Launcher.
- **10 pets** (Kenney Cube Pets): fighters, shooters, a healer, a coin collector and a roaring lion. Pets follow you,
  fight, and level to 160 with rarity perks too.
- **9 enemy types:** Husk, Runner, Spitter (ranged acid), Exploder, Smasher, Storm Drone (flies over walls),
  Riot Husk (shield blocks frontal shots), Warden (heals allies) and the Storm King boss every 5th wave.
- **Edit Base mode:** build wood/brick/metal walls, spike traps, freeze traps and turret towers on a grid.
- **Warnings:** portal beams, red lane arrows, "next enemy from" text, off-screen arrows and a minimap show where
  enemies come from and will come from next; the base screen previews the next wave.
- No coin upgrades to grind: the house grows on its own with the wave (bungalow → fortified home), and walls,
  traps and turrets scale with the wave too.
- Bloom, dynamic shadows, storm wall, shield dome, adaptive resolution/effects for smooth frame rates.

Credits: models by Kenney and Quaternius (CC0), engine three.js (MIT). See `docs/models/CREDITS.md`.
