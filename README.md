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
| First-person toggle (eye button) | V |
| Pause button | Esc |

### Features
- **Guns and heroes level up by use, 1 → 160.** Rarity climbs Common → Uncommon → Rare → Epic → Legendary → Mythic,
  the gun changes color, and every new rarity unlocks a new ability (crits, burn, freeze, chain lightning, explosive rounds,
  lifesteal, orbital strikes, multishot, chain-reaction kills...). Each gun has its own set.
- **19 heroes**, each with a unique active ability, a passive and 5 rarity perks: Rex, Bolt, Nova, Cyra, Doc, Skye,
  Luna, Zed, Titan, Blaze (Flame Nova), Frost (Blizzard), Volt (Chain Storm), Ranger (Arrow Rain), Brick (Fortress
  taunt), Shade (Vanish), Gizmo (Overclock your base), Sage (Healing Grove), Ace (Air Strike) and Hex (Curse).
- **27 guns**, including the Laser Rifle, Shock Shotgun, Acid Launcher, Cluster Bomb, Gatling Laser, Ripsaw Launcher,
  Black Hole Gun, Seeker Missiles, Cryo Cannon and Anti-Materiel Rifle.
- **34 pets** (Kenney Cube Pets), including elemental versions: Inferno fox, Glacier penguin, Zapper bee, Nightpaw,
  Midas the golden pig, Prism deer, Robo-Rex, Phoenix, Mammoth and Boo the ghost bunny.
- **52 enemy types**, including many flyers (Wasp and Taker drones, Mender and EMP drones, Storm Rays, Gunships,
  Bombardiers, Swarm Carriers, Sky Raider ships) plus Flingers that throw husks over your walls and Mist Blasters.
  Elite enemies (gold ring, tougher, richer) appear more and more, and waves grow bigger and deadlier.
- **12 bosses**, with a new one each 5 waves and several at once later: Storm King, Hive Queen, Mist Smasher,
  Gunship Titan, Frost Colossus, Inferno Golem, Sky Galleon, Plague Mother, Thunder Titan, Void Reaper,
  Mecha Overlord (mana shield) and Hive Carrier. Bosses slam, bombard, EMP-stun towers, freeze, burn, pull you in
  and call lightning.
- **2 player co-op:** tap **2 PLAYER**, host a game and send the 4-letter code to a friend; they open the same
  game link, tap 2 PLAYER, type the code and join. The host runs the waves, base and enemies; each player brings
  their own hero, gun and pet, both earn the coins, and a downed player respawns while the partner holds on.
  Uses the claude.ai artifact's live room, so both players need access to the shared link.
- **Edit Base mode:** 14 pieces (walls including thorn walls, spike/freeze/flame traps, healing pads, turret towers,
  tesla coils, mortars, flak cannons, laser towers and sniper towers). Tap a piece to **upgrade it with coins up to
  level 10**. Enemies and bosses break every kind of building, and broken buildings stay broken until you fall.
- **Warnings:** portal beams, red lane arrows, "next enemy from" text, off-screen arrows and a minimap show where
  enemies come from and will come from next; the base screen previews the next wave.
- No coin upgrades to grind: the house grows on its own with the wave (bungalow → fortified home), and walls,
  traps and turrets scale with the wave too.
- Bloom, dynamic shadows, storm wall, shield dome, adaptive resolution/effects for smooth frame rates.

Credits: models by Kenney and Quaternius (CC0), engine three.js (MIT). See `docs/models/CREDITS.md`.
