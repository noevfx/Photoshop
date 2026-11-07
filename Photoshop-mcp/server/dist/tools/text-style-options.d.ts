import type { PhotoshopErrorEnvelope } from '../errors/envelope.js';
export declare const TEXT_ALIGNMENTS: readonly ["LEFT", "CENTER", "RIGHT", "LEFTJUSTIFIED", "CENTERJUSTIFIED", "RIGHTJUSTIFIED", "FULLYJUSTIFIED"];
export type TextAlignment = (typeof TEXT_ALIGNMENTS)[number];
export type TextKind = 'point' | 'paragraph';
export interface TextStyleOptions {
    tracking?: number;
    leading?: number;
    auto_leading?: boolean;
    kind?: TextKind;
    box_width?: number;
    box_height?: number;
    alignment?: TextAlignment;
    fontName?: string;
    fontSize?: number;
    red?: number;
    green?: number;
    blue?: number;
}
export interface TextRangeStyle {
    from: number;
    to: number;
    fontName?: string;
    fontSize?: number;
    red?: number;
    green?: number;
    blue?: number;
}
export declare function parseTextStyleArgs(args: Record<string, unknown>, options: {
    requireSome: boolean;
}): {
    style: TextStyleOptions;
    error?: PhotoshopErrorEnvelope;
};
export declare function hasTextStyle(style: TextStyleOptions): boolean;
export declare function emitTextStyleLiteral(style: TextStyleOptions): string;
export declare function parseTextRangesArg(args: Record<string, unknown>): {
    ranges: TextRangeStyle[];
    error?: PhotoshopErrorEnvelope;
};
export declare function emitTextRangesLiteral(ranges: TextRangeStyle[]): string;
//# sourceMappingURL=text-style-options.d.ts.map