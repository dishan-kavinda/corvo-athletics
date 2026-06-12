# Final Polish: Layout & CSS Refinement

Please copy and paste the entire block below into your terminal to instruct Claude Code to fix the layout.

---

**PROMPT FOR CLAUDE CODE:**

You are tasked with fixing the CSS layout architecture and parallax broken boundaries on the Corvo Athletic homepage. We must ensure the website looks flawless, with zero empty gaps or awkwardly cropped images on any screen size. 

Follow these instructions exactly:

### Step 1: Fix the Parallax Component (`ParallaxImage.tsx`)
- **Fix the Gap:** The `motion.div` inside `ParallaxImage` currently has `inset: 0`. When Framer Motion translates it along the Y-axis by 80px, it pulls the top edge down and exposes an empty gap. You must expand the bounding box! Change the styling to `top: "-15%", bottom: "-15%", left: "-5%", right: "-5%"`. 
- **Fix the Transform:** Update the `useTransform` hook for `y` to map from `[0, 1]` to `["-10%", "10%"]` rather than relying on fixed numbers. This ensures it always moves relative to the wrapper height.
- **Fix the Image Cropping:** The AI-generated images are square (`1024x1024`). The `Image` component is currently centering them, which chops off the athlete's face on ultra-wide screens. You MUST update the `Image` tag's styling to include `objectPosition: 'center 20%'`. This biases the crop towards the top where the focal point is.

### Step 2: Refine the Typography Layout (`page.tsx`)
- **Fix the Hero Alignment:** The massive "HUNT WITHOUT MERCY" text is sitting awkwardly in the container. Update the Hero text container div to `className="relative h-full flex flex-col justify-end px-6 md:px-10 lg:px-14 pb-24 md:pb-32"`. 
- **Fix the Font Scaling:** Update the massive heading `fontSize` to `clamp(3rem, 9vw, 8.5rem)` and squeeze the line-height tightly using `leading-[0.85]`. 

### Step 3: Polish the Global Layout
- Do a full pass on the homepage layout. The design must be brutalist and tight. Eliminate excessive vertical white space (or black space) between the hero and the category grid. 
- Ensure that the `fabric_luxury.png` and `fabric_savage.png` images used in the "Corvo Standard" sections span full-bleed edge-to-edge without any padding gaps.
- Run `pnpm run build` or `pnpm dev` to verify the CSS behaves perfectly across both desktop and mobile viewports.
