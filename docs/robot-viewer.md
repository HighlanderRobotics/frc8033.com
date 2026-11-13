# Robot photos and interactive CAD

The Wisp page includes a locally hosted, on-demand Three.js viewer. The model is derived from the supplied `Wisp Full Bot Assembly.step`; no CAD file is uploaded to an external conversion service. The original STEP remains outside the website. Conversion preserves assembly placement and CAD colors. The viewer uses meters and a Z-up camera aligned with the supplied assembly.

The browser supports orbit, pan, zoom, preset views, automatic rotation, keyboard controls, and full screen where available. Loading and graphics errors retain a readable fallback. The renderer pauses when offscreen and renders only when the camera changes. No model or Three.js download starts until the visitor chooses to load the viewer.

Rendering listens for OrbitControls change events and keeps them pending until the next frame draws them. Touchpad pinch/wheel handlers update the camera immediately, so checking only the next `controls.update()` return value can miss those changes. The regression check exercises the real controls with successive Ctrl+wheel pinch steps, including an already-consumed update, idle frames, and offscreen/resume behavior.

## Regenerating the model

Normal Astro builds use the checked-in compressed model and require only Node.js. Python and OpenCascade are conversion tools, not hosting requirements.

To convert a replacement assembly, create an isolated Python environment and install `cadquery-ocp==7.9.3.1.1`. Then run:

```powershell
python scripts/convert-step.py 'C:\path\Wisp Full Bot Assembly.step' public/models/wisp.glb.gz
node scripts/optimize-model.mjs
npm run check
```

The scripts write the compressed model and `public/models/wisp.json`, which records the original filename, SHA-256 hash, geometry counts, conversion settings, and sizes. An intermediate GLB is placed in the ignored `.astro/cad-export/` directory. The optimizer joins compatible geometry by material and simplifies fine tessellation within a 0.08% relative error limit. All output stays local. Review the model visually before committing it.

The final Wisp asset is approximately 9.7 MB, with 765,133 triangles and 70 draw calls, down from 2,524,190 triangles and 1,498 rendered meshes. Assembly bounds and colors are retained. The CAD axes are preserved, with an upright Z-up view; no extra quarter-turn is applied to the robot.

The `.glb.gz` is decompressed explicitly in the browser with `DecompressionStream`; this works on static hosts without custom server headers, including GitHub Pages. The browser must support WebGL 2 and `DecompressionStream`.

## Verified overview photo mapping

All seven overview images are photographs. They are matched by robot, season, and their existing individual-page content:

| Robot | Season | Source photo filename |
| --- | --- | --- |
| Wisp | 2026 | `_ALE2342.jpg` |
| Kelpie | 2025 | `robot-website.png` |
| Banshee | 2024 | `DSC_9440_Original.jpeg` |
| Paddo | 2023 | `Paddo-3.jpg` |
| Selkie | 2022 | `Selkie.jpg` |
| Whirlpool | 2021 | `Whirlpool.JPG` |
| Nessie | 2020 | `Nessie-2.png` |

The full local asset paths are in `src/data/robots.json`. The CMS-editable overview stores the same paths. Build validation checks that each robot card uses its registry photo. The Robots navigation sorts by season year, descending, while keeping All Robots first.

## Contact form

The contact page embeds the supplied Piedmont Makers Google Form. Google controls its fields, validation, and response storage. The page includes an accessible iframe title, a responsive surrounding layout, an external form link, and the public team email address. The old email-composing form and handler were removed. Verification reads the embedded form without submitting a response or modifying Google Drive.
