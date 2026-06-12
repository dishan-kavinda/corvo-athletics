# Master Instructions for Claude Code: Global UX/UI Redesign

Please copy and paste the entire block below into your terminal to instruct Claude Code on exactly what to do.

---

**PROMPT FOR CLAUDE CODE:**

You are tasked with executing a massive, Awwwards-level global UX/UI redesign for Corvo Athletic. We want to build the most premium, cinematic, and interactive athletic apparel website in existence. You must prioritize buttery-smooth animations, brutalist/luxury aesthetic choices, high-performance 3D rendering, and flawless mobile responsiveness.

Follow these instructions systematically. **Do not cut corners.**

### Step 1: Install Required Libraries
Install the following dependencies needed for our high-end physics and interactions:
```bash
pnpm add @studio-freight/lenis lucide-react tailwind-merge clsx
```
*Note: `framer-motion`, `@react-three/fiber`, and `@react-three/drei` are already installed.*

### Step 2: Fix Logo Component (Restore the Red Eye)
Currently, `src/components/layout/Logo.tsx` uses `maskImage` to display the logo. This completely strips the colors out of the SVG, meaning our signature red eye is missing from the header.
- **Action:** Refactor `Logo.tsx` to use an inline React SVG component instead of a mask.
- Parse the `logo-savage-clean.svg` file. The main raven head path should use `fill="currentColor"` (so it reacts to light/dark themes), but the second path (the eye) must be strictly set to `fill="#FF0000"`.
- Ensure it scales smoothly based on the `height` prop.

### Step 3: Overhaul Header & MobileNav (Framer Motion)
The current navigation uses basic CSS transitions. Upgrade it to world-class physics-based interactions:
- **Action (`MobileNav.tsx`):** Use Framer Motion (`<AnimatePresence>`) to orchestrate the mobile menu. The blurred backdrop should smoothly `opacity: 0 -> 1`. The menu panel should slide in using a physics `spring`. The navigation links ("01 Shop", "02 Training", etc.) must stagger their entrance, sliding in one by one after the panel opens.
- **Action (`Header.tsx`):** Implement a "Magnetic Button" wrapper using Framer Motion for the icons (Search, Account, Cart). When the user's cursor gets close, the icon should physically pull towards the cursor slightly, snapping back when they leave.

### Step 4: True 3D Logo & Mobile Visibility Fix
The 3D component in `src/components/3d/HeroScene.tsx` is currently just a translucent plane with a canvas texture, and it looks tiny on mobile screens due to a fixed camera FOV.
- **Action (Mobile Visibility):** Update the `<Canvas>` or implement a hook inside the canvas (like `useThree()`) to dynamically adjust the camera. For example, if `window.innerWidth < 768`, push the camera back (increase `z`) or increase the `fov` so the logo is massive and imposing on portrait screens.
- **Action (True 3D Extrusion):** Stop using a textured plane. Use `@react-three/drei`'s `<Svg>` component or `SVGLoader` to parse `logo-savage-clean.svg` and extrude the paths into actual 3D geometry. 
- **Action (Premium Materials):** Apply a `MeshPhysicalMaterial` to the extruded logo. Give it high `metalness`, low `roughness`, and `clearcoat` so it looks like polished metal or glass.
- **Action (Lighting & Interactions):** Wrap the logo in `<Float>` or `<PresentationControls>` from drei so the user can grab, spin, and toss the logo with smooth friction. Add an `<Environment preset="studio" />` so the physical material has high-quality reflections. Finally, hook into the `DeviceOrientation` API on mobile so the logo subtly tilts when the user physically tilts their phone.

### Step 5: Global Smooth Scrolling & Page Transitions
- **Action (Smooth Scroll):** Create a `SmoothScroll.tsx` provider using `@studio-freight/lenis`. Wrap the entire application layout in this provider so native scrolling is replaced with fluid momentum scrolling.
- **Action (Page Transitions):** Update the Next.js `template.tsx` to use Framer Motion. Every page change should trigger a cinematic fade or slide transition, rather than a hard flash.
- **Action (Scroll Reveal):** Throughout the `Shop`, `About`, and `Home` pages, replace static text and images with Framer Motion `whileInView` wrappers. As the user scrolls, typography should slide up with clipping masks, and product images should gracefully scale down from `1.1` to `1` with a parallax effect.

**Execution:** Please execute these steps file-by-file, running tests/builds as you go to ensure performance remains high (60fps). Begin with Step 1 and Step 2.
