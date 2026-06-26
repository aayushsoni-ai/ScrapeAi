
// //generate
// const userPrompt = `Use the user-provided styleGuide for all visual decisions: map its colors, typography scale, spacing, and radii directly to Tailwind v4 utilities (use arbitrary color classes like text-[#RRGGBB] / bg-[#RRGGBB] when hexes are given), enforce WCAG AA contrast (≥4.5:1 body, ≥3:1 large text), and if any token is missing fall back to neutral light defaults. Never invent new tokens; keep usage consistent across components.

// Inspiration images (URLs):

// You will receive up to 6 image URLs in images[].

// Use them only for interpretation (mood/keywords/subject matter) to bias choices within the existing styleGuide tokens (e.g., which primary/secondary to emphasize, where accent appears, light vs. dark sections).

// Do not derive new colors or fonts from images; do not create tokens that aren’t in styleGuide.

// Do not echo the URLs in the output JSON; use them purely as inspiration.

// If an image URL is unreachable/invalid, ignore it without degrading output quality.

// If images imply low-contrast contexts, adjust class pairings (e.g., text-[#FFFFFF] on bg-[#0A0A0A], stronger border/ring from tokens) to maintain accessibility while staying inside the styleGuide.

// For any required illustrative slots, use a public placeholder image (deterministic seed) only if the schema requires an image field; otherwise don’t include images in the JSON.

// On conflicts: the styleGuide always wins over image cues.
//     colors: ${colors
//       .map((color: any) =>
//         color.swatches
//           .map((swatch: any) => {
//             return `${swatch.name}: ${swatch.hexColor}, ${swatch.description}`;
//           })
//           .join(", ")
//       )
//       .join(", ")}
//     typography: ${typography
//       .map((typography: any) =>
//         typography.styles
//           .map((style: any) => {
//             return `${style.name}: ${style.description}, ${style.fontFamily}, ${style.fontWeight}, ${style.fontSize}, ${style.lineHeight}`;
//           })
//           .join(", ")
//       )
//       .join(", ")}
//     `;
