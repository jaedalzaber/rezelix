# Architectural Design Studio - Three.js Website Implementation Plan

## Goal

Build a scroll-driven, cinematic website for an Architectural Design Studio using the existing Next.js + Payload CMS + React Three Fiber stack.

The site should feel like one continuous story:

1. A house begins as CAD drawings and wireframes.
2. It grows into a full exterior.
3. Landscape elements appear.
4. The camera moves into a room.
5. Interior design details and products are introduced.
6. The experience ends with a VR-style tour and cinematic fly-through.

The website should work as both a portfolio and a sales tool, with each visual phase tied to a service offering.

## Core Experience

- Scroll controls the narrative progression.
- The 3D scene is the main hero of the website.
- Each phase introduces one service category.
- Motion should feel premium, architectural, and deliberate.
- The experience must remain usable on desktop and mobile.
- The scene should degrade gracefully for low-end devices.

## Recommended Stack

- `Next.js` App Router for routing and server rendering.
- `Payload CMS` for content, services, case studies, hotspots, and product data.
- `React Three Fiber` for the 3D experience.
- `@react-three/drei` for helpers like `ScrollControls`, `Html`, `Environment`, and loaders.
- `GSAP` or a scroll-driven motion layer for timeline control if needed.
- `Lenis` or a custom smooth scroll layer if the final interaction feels better with smoother scrolling.
- `PostgreSQL` via the existing Payload adapter.

## Experience Structure

### Entry Flow

- The landing section introduces the studio and establishes the visual tone.
- The page then transitions into the interactive 3D scroll story.
- The user scrolls down to progress the build process.
- Optional UI anchors allow jumping between phases.

### Narrative Phases

The concept currently skips Phase 5, so this plan keeps the user-facing naming intact and reserves that step for a transition beat if needed.

| Phase | Experience | Service Tie-In | Primary Visual Action |
|---|---|---|---|
| 1 | CAD Drawings | Architectural planning | Blueprint lines, wireframe outline, sketch overlays |
| 2 | Exterior Renderings | Exterior design | Structure grows from foundation to solid shell |
| 3 | Landscape | Landscape design | Trees, shrubs, driveway, and site context appear |
| 4 | Interior Renderings | Interior visualization | Camera moves through the door into a room |
| 5 | Reserved transition | Optional interlude | Use for service CTA, project stats, or a narrative pause |
| 6 | Interior Design | Furniture and decor | Furnishings and decor populate the space |
| 7 | Product Design | Product detail showcase | Focus on one object and allow product switching |
| 8 | VR Tours | Interactive tour mode | Hotspot-based navigation and 360 spin |
| 9 | Video Tour | Cinematic ending | Pull back and end with a sweeping fly-through |

## Technical Architecture

### Frontend Layout

- One primary landing page with a long-form scroll narrative.
- A pinned WebGL section that stays fixed while scroll progression updates the scene.
- Supporting content panels for service copy, project details, and calls to action.
- Optional secondary pages for services, case studies, and contact.

### 3D Scene Model

Create the site around a single master house scene with multiple staged states.

- State 1: blueprint / wireframe.
- State 2: structural shell.
- State 3: exterior shell plus site context.
- State 4: camera enters interior.
- State 6: furnished room.
- State 7: product close-up.
- State 8: VR tour mode with hotspots.
- State 9: cinematic exit.

This should be implemented as a reusable scene state machine, not as separate disconnected scenes.

### State Management

- Use one scene controller that maps scroll progress to timeline values.
- Keep camera motion, object visibility, and postprocessing in a single orchestration layer.
- Use scene-specific state flags for transitions such as:
  - `isBlueprint`
  - `isBuilding`
  - `isLandscaped`
  - `isInterior`
  - `isProductFocus`
  - `isTourMode`
  - `isOutro`

### Asset Pipeline

- Start from CAD or massing geometry.
- Export optimized meshes to `glTF` or `GLB`.
- Create separate LOD or visibility states for major phases.
- Prepare texture sets for exterior, interior, and product close-up shots.
- Export landscape props as lightweight reusable assets.
- Keep polygon counts and texture sizes under a defined budget.

## Payload CMS Content Model

Payload should manage the content that changes without code deployments.

### Suggested Collections

- `Projects`
  - Project title
  - Summary
  - Hero image or teaser render
  - Featured phase assets
  - Case study content
  - SEO fields

- `Services`
  - Service name
  - Phase association
  - Short description
  - CTA text
  - Icon or thumbnail

- `Scene Phases`
  - Phase title
  - Scroll position / ordering
  - Camera target
  - Text content
  - Background tone
  - Associated asset references

- `Hotspots`
  - Scene reference
  - 3D position
  - Label
  - Destination or action
  - Product link or detail panel content

- `Products`
  - Product name
  - Variant list
  - Material / finish options
  - Featured image
  - External link or inquiry CTA

- `Site Settings`
  - Hero copy
  - Intro copy
  - Contact info
  - Social links
  - CTA labels

## Key Implementation Milestones

### Milestone 1 - Discovery and preproduction

- Confirm story beats for each phase.
- Decide whether the house is a real project or a conceptual hero model.
- Collect references for blueprint, construction, landscape, interior, and VR tour moments.
- Define animation style and brand direction.
- Establish performance budget and target devices.

### Milestone 2 - Scene system foundation

- Set up the Three.js scene in a dedicated client component.
- Build the scroll progress controller.
- Add camera controls and timeline interpolation.
- Create the initial house model and base environment.
- Establish responsive canvas sizing and fallback UI.

### Milestone 3 - Phase 1 to Phase 3

- Blueprint phase with line drawing and wireframe reveal.
- Structural build animation from foundation upward.
- Landscape population with staged asset appearance.

### Milestone 4 - Phase 4 to Phase 6

- Interior camera move.
- Room reveal with controlled framing.
- Furniture and decor assembly animation.
- Material polishing and lighting tuning.

### Milestone 5 - Phase 7 product interaction

- Add object selection in the room.
- Let the user switch product variants.
- Animate product replacement or material swap.
- Add detail-focused camera positioning.

### Milestone 6 - Phase 8 tour mode

- Add hotspots.
- Enable click-to-move interaction.
- Support 360 spin or tour transitions.
- Ensure navigation feels intuitive on desktop and mobile.

### Milestone 7 - Phase 9 cinematic outro

- Pull back from the room.
- Reframe the full house.
- End with a polished fly-through and CTA.

### Milestone 8 - CMS integration and polish

- Connect all phase copy to Payload CMS.
- Connect service cards and case studies.
- Add SEO metadata, previews, and draft editing.
- Finalize motion easing, copy, and responsive behavior.

## Engineering Checklist

### Project Setup

- [ ] Confirm the landing page route that will host the interactive experience.
- [ ] Add Three.js dependencies if they are not already installed.
- [ ] Create the main R3F scene component.
- [ ] Split the WebGL scene into reusable modules.
- [ ] Define a shared scene state model.
- [ ] Add a loading strategy for 3D assets.
- [ ] Add a low-end device fallback.

### CMS Setup

- [ ] Decide which content belongs in Payload versus hard-coded scene logic.
- [ ] Create collections for phases, services, products, hotspots, and projects.
- [ ] Add references between services and scroll phases.
- [ ] Add SEO fields and preview support.
- [ ] Run type generation after schema changes.
- [ ] Regenerate the import map if custom components are added.

### 3D Scene

- [ ] Build the blueprint wireframe state.
- [ ] Build the structural growth animation.
- [ ] Build the landscape population sequence.
- [ ] Build the interior reveal sequence.
- [ ] Build the furniture and decor assembly.
- [ ] Build the product focus close-up.
- [ ] Build the VR hotspot mode.
- [ ] Build the final cinematic fly-through.

### Interaction

- [ ] Map scroll progress to scene states.
- [ ] Add optional section nav or phase jump controls.
- [ ] Add hotspot hover and click feedback.
- [ ] Add product selection controls.
- [ ] Add camera transition easing.
- [ ] Add pause or reduced-motion behavior.

### Performance

- [ ] Compress and optimize all models and textures.
- [ ] Avoid unnecessary re-renders in the scene.
- [ ] Use lazy loading for heavy assets.
- [ ] Limit draw calls and material complexity.
- [ ] Test on mobile Safari and mid-range Android devices.
- [ ] Add a fallback poster or static image for unsupported cases.

### Content and Design

- [ ] Write short service descriptions for each phase.
- [ ] Prepare studio branding and typography direction.
- [ ] Create CTA copy for inquiries and consultations.
- [ ] Prepare project imagery for supporting pages.
- [ ] Define the tone for microcopy and labels.

### QA and Launch

- [ ] Test scroll progression from start to finish.
- [ ] Test phase transitions at multiple viewport sizes.
- [ ] Test pointer interaction, hotspot navigation, and product selection.
- [ ] Verify animation timing and camera framing.
- [ ] Verify Payload preview and published states.
- [ ] Verify metadata, sitemap, and routing.
- [ ] Run TypeScript validation before release.

## Content Checklist

- [ ] Studio name, tagline, and positioning.
- [ ] Hero copy.
- [ ] Service copy for each phase.
- [ ] Project gallery or case study content.
- [ ] Contact details and lead capture form.
- [ ] Social proof, testimonials, or awards.
- [ ] Product catalog for the phase 7 selector.
- [ ] Hotspot labels and destination logic.
- [ ] Final CTA copy.

## Asset Checklist

- [ ] CAD or blueprint reference.
- [ ] Base house model.
- [ ] Exterior render-ready model.
- [ ] Landscape props.
- [ ] Interior furnishing set.
- [ ] Product showcase objects.
- [ ] Tour hotspot markers.
- [ ] Cinematic lighting and environment assets.
- [ ] Poster image for loading and fallback.

## Risks and Decisions

- The biggest risk is trying to animate too many things independently instead of treating the site as one controlled timeline.
- Another risk is excessive model complexity, which could hurt mobile performance.
- Product switching in Phase 7 should be simple enough that it feels elegant, not like a catalog UI inside a 3D scene.
- VR tour behavior should be intuitive before it becomes impressive.
- The user flow should remain readable even if WebGL fails or is disabled.

## Suggested Build Order

1. Lock the narrative and content structure.
2. Build the scene controller and scroll system.
3. Implement phases 1 to 3 first because they establish the visual language.
4. Add the interior sequence and room framing.
5. Add product switching and hotspot navigation.
6. Add the final fly-through and CTA end state.
7. Connect everything to Payload CMS.
8. Tune performance, accessibility, and responsive behavior.

## Definition Of Done

- The homepage tells the full design story from blueprint to final tour.
- Scroll progression reliably controls the phase transitions.
- Each phase maps to a studio service.
- The 3D scene is performant on desktop and acceptable on mobile.
- Content can be edited in Payload without code changes for routine updates.
- The site has a polished ending with a clear inquiry CTA.


pnpm install gsap @gsap/react
pnpm install zustand
pnpm install lenis
pnpm install @react-three/postprocessing
pnpm install camera-controls