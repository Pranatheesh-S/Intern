# Futura-Edtech Engineering & Quality Directives

Welcome to the **Futura-Edtech** interactive learning platform codebase. All AI coding assistants, agents, and contributors must strictly adhere to these architectural, aesthetic, and resilience rules.

---

## 1. Zero-Placeholder Policy & Code Completeness
* **Complete Implementations Only:** NEVER output `// TODO`, `/* Add remaining code here */`, placeholder mock data, or truncated code snippets. Every component, physics handler, and UI view must be 100% complete, fully implemented, and runnable.
* **Preserve Unrelated Logic:** Never delete existing features, routes, or docstrings unless explicitly asked by the user.

---

## 2. Visual Design & Aesthetic Excellence
* **Isometric & Tilt-Shift 3D Style:** Interactive activities and 2D canvas boards should use high-detail, warm isometric 3D illustrations with rich volumetric shading, ambient occlusion, and subtle depth.
* **Modern Color Palettes:**
  - **Environment & Canvases:** Clean cards with rounded corners (`borderRadius: 16px - 24px`), subtle emerald/slate borders (`1.5px - 2px solid #A7F3D0` / `#E2E8F0`), and soft ambient shadows (`boxShadow: 0 10px 30px rgba(0,0,0,0.06)`).
  - **Action & Accent Buttons:** High-contrast amber-orange gradients (`linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`) with white bold text (`fontWeight: 900`, `boxShadow: 0 4px 14px rgba(217, 119, 6, 0.35)`).
* **Typography:** Modern Google Fonts (`Inter`, `Outfit`, `JetBrains Mono`). Avoid default browser fonts.
* **Fluid Micro-Animations:** Use `framer-motion` for transitions, spring pop-ins, and state changes.

---

## 3. 3D Graphics, WebGL & Canvas Guidelines
* **Canvas 2D API Precision:**
  - Verify all 2D context signatures (e.g., `ctx.arcTo(x1, y1, x2, y2, radius)` requires exactly 5 arguments; `ctx.ellipse()` requires 8 arguments).
  - Ensure high-DPI scaling: Set `canvas.width` and `canvas.height` to exact pixel dimensions, with CSS `width: 100%` and `height: 100%`.
* **Three.js & React Three Fiber (R3F):**
  - **Additive Blending:** Light beams, sun rays, coronas, and magnetic field lines must specify:
    ```jsx
    blending={THREE.AdditiveBlending}
    transparent={true}
    depthWrite={false}
    ```
  - **Camera & Frustum:** Align directional lights with primary light sources; configure camera FOV and aspect ratio to prevent edge bleeding or blank margins.
  - **Clean Up & Memory Safety:** Dispose of textures, geometries, and materials on unmount or context switch.

---

## 4. WebGL Error Handling & Error Boundaries
* **Fault-Tolerant Rendering:** Wrap all interactive Canvas scenes, 3D WebGL viewports, and dynamic activity pages in `<ErrorBoundary>` components.
* **No Cascading Failures:** A failure in an isolated simulation component must display a clean retry UI without crashing the global application or causing a blank screen.
* **Passive Overlays:** All background guide overlays and informational canvas layers must set `pointerEvents: 'none'` to prevent blocking user drag and click interactions.

---

## 5. Directory Structure Standards
* `src/components/`: Reusable shared UI, global layouts, and Error Boundaries.
* `src/science/`: Curriculum science simulations organized by grade and chapter.
* `src/social/`: Interactive geography, history, and civic lab modules.
* `src/maths/`: Geometric labs, coordinate systems, and interactive math tools.
* `src/hooks/`: Reusable custom hooks (audio, speech synthesis, viewport measurement).
* `src/styles/`: Central design system tokens and theme variables.
