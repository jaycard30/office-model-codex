# Pull Request Conflict Resolution Notes

This repository currently keeps the Office scene in two top-level files:

- `index.html`
- `src/main.js`

Because both files are central entry points, concurrent PRs often conflict on the same lines.

## Recommended merge order

1. Keep the `index.html` shell from the target branch.
2. Keep the latest `src/main.js` import URLs that use browser-resolvable ESM endpoints.
3. Reapply scene-object additions after imports and renderer setup.

## Conflict-sensitive lines

The most common conflict area is the first two import lines in `src/main.js`. If conflict markers appear, keep the variant using `esm.sh`:

```js
import * as THREE from 'https://esm.sh/three@0.162.0';
import { PointerLockControls } from 'https://esm.sh/three@0.162.0/examples/jsm/controls/PointerLockControls.js';
```

These imports avoid GitHub Pages runtime issues where the initial overlay shows but the scene never starts.
