/**
 * MCP blend-mode names (Photoshop UI) → ExtendScript BlendMode enum members.
 *
 * `COLOR` is the UI name; the DOM enum is `BlendMode.COLORBLEND`.
 * @see https://theiviaxx.github.io/photoshop-docs/Photoshop/BlendMode/COLORBLEND.html
 */
export declare const LAYER_BLEND_MODE_ENUM: readonly ["NORMAL", "DISSOLVE", "DARKEN", "MULTIPLY", "COLORBURN", "LINEARBURN", "DARKERCOLOR", "LIGHTEN", "SCREEN", "COLORDODGE", "LINEARDODGE", "LIGHTERCOLOR", "OVERLAY", "SOFTLIGHT", "HARDLIGHT", "VIVIDLIGHT", "LINEARLIGHT", "PINLIGHT", "HARDMIX", "DIFFERENCE", "EXCLUSION", "SUBTRACT", "DIVIDE", "HUE", "SATURATION", "COLOR", "LUMINOSITY"];
export type LayerBlendMode = (typeof LAYER_BLEND_MODE_ENUM)[number];
/**
 * Resolve a caller blend-mode token to a safe ExtendScript identifier.
 * Returns null for unknown or non-alphabetic values (never interpolate those).
 */
export declare function resolveLayerBlendMode(raw: unknown): string | null;
//# sourceMappingURL=blend-mode.d.ts.map