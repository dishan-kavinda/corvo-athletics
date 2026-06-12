# Master Instructions for Claude Code: Cinematic Redesign

Please copy and paste the entire block below into your terminal to instruct Claude Code on exactly what to code.

---

**PROMPT FOR CLAUDE CODE:**

You are tasked with executing a major aesthetic pivot for the Corvo Athletic homepage. We are abandoning the 3D rotating logo concept in favor of an ultra-premium, cinematic, full-screen photography layout driven by Framer Motion parallax effects. Antigravity has already generated the required high-res imagery and placed it in the `public/` directory.

Follow these instructions systematically:

### Step 1: Clean Up Legacy 3D Code
- Verify that `src/components/3d/HeroScene.tsx`, `HeroSceneClient.tsx`, and `LuxuryHeroSceneClient.tsx` are deleted. If they still exist, delete them.
- Remove `@react-three/fiber` and `@react-three/drei` from the homepage imports and `package.json` to significantly improve site performance.

### Step 2: Build `ParallaxImage.tsx`
Create a new file `src/components/motion/ParallaxImage.tsx`:
- It must be a Client Component (`"use client"`).
- Use Framer Motion's `useScroll` and `useTransform` to target a wrapper `div`.
- Inside the wrapper, place a `motion.img`. As the user scrolls down, the image should slowly drift downward (parallax effect) and subtly scale up.
- Overlay a dark CSS linear-gradient on top of the image so that white typography remains highly readable.

### Step 3: Rewrite the Home Page (`src/app/home/page.tsx`)
Completely redesign `page.tsx` to utilize the new assets:
- **Dynamic Imagery:** Read the aesthetic cookie (`isLuxury`). 
  - If `isLuxury` is true, pass `/hero_luxury.png` to the `ParallaxImage` in the Hero section, and use `/fabric_luxury.png` as the background for the "Corvo Standard" section.
  - If `isLuxury` is false (Savage mode), pass `/hero_savage.png` and `/fabric_savage.png` respectively.
- **Cinematic Hero:** The hero section should be `100svh` with the `ParallaxImage` spanning edge-to-edge behind the massive "HUNT WITHOUT MERCY" or "THE PURSUIT OF EXCELLENCE" typography.
- **Visual Category Grid:** Replace the current text-only category blocks in the "Shop by Category" section with a visual grid. Give them an elegant hover effect using Framer Motion.

### Step 4: Kinetic Typography & Polish
- Ensure all typography is massive and kinetic. Wrap headers in `whileInView` Framer Motion components so the text slides or fades up elegantly as the user scrolls down the page.
- Ensure the site maintains a brutalist, dark aesthetic for Savage mode, and a clean, high-contrast minimalist aesthetic for Luxury mode.

**Execution:** Please execute these steps and rebuild the homepage to be a visual masterpiece.
