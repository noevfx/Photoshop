import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPhotoshopMcpHomeDir } from '../../lib/export-paths.js';
import { Logger } from '../../utils/logger.js';
const logger = new Logger('UIPreviews');
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const SAFE_SEGMENT = /^[A-Za-z0-9_-]{1,128}$/;
const SAFE_FILE = /^[A-Za-z0-9_-]{1,128}-\d{1,3}\.(jpg|png|webp)$/;
const EXT_BY_MIME = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const MIME_BY_EXT = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
};
function previewsRoot() {
    return join(getPhotoshopMcpHomeDir(), 'previews');
}
function chatDir(chatId) {
    if (!SAFE_SEGMENT.test(chatId))
        return null;
    return join(previewsRoot(), chatId);
}
function asImage(value) {
    if (!value || typeof value !== 'object')
        return null;
    const obj = value;
    if (obj.type !== 'image')
        return null;
    // MCP CallToolResult content: { type: 'image', data, mimeType }
    if (typeof obj.data === 'string' && typeof obj.mimeType === 'string') {
        return { data: obj.data, mimeType: obj.mimeType };
    }
    // Anthropic content block: { type: 'image', source: { type: 'base64', media_type, data } }
    const source = obj.source;
    if (source && typeof source.data === 'string' && typeof source.media_type === 'string') {
        return { data: source.data, mimeType: source.media_type };
    }
    return null;
}
/** Find image content blocks in any tool-output shape we receive (MCP, AI SDK, Agent SDK). */
export function extractToolImages(output, depth = 0) {
    if (output == null || depth > 4)
        return [];
    const direct = asImage(output);
    if (direct)
        return [direct];
    if (Array.isArray(output)) {
        return output.flatMap((item) => extractToolImages(item, depth + 1));
    }
    if (typeof output === 'object') {
        const obj = output;
        const nested = obj.content ?? obj.value ?? obj.output;
        if (nested !== undefined)
            return extractToolImages(nested, depth + 1);
    }
    return [];
}
/**
 * Persist any images in a tool output and return lightweight references.
 * Never throws: a preview that cannot be stored must not fail the tool call.
 */
export function persistToolImages(chatId, toolCallId, output) {
    if (!chatId)
        return [];
    const images = extractToolImages(output);
    if (images.length === 0)
        return [];
    const dir = chatDir(chatId);
    const safeCallId = toolCallId.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 96) || 'tool';
    if (!dir)
        return [];
    const refs = [];
    try {
        mkdirSync(dir, { recursive: true, mode: 0o700 });
        images.forEach((img, index) => {
            const ext = EXT_BY_MIME[img.mimeType.toLowerCase()];
            if (!ext)
                return;
            const bytes = Buffer.from(img.data, 'base64');
            if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES)
                return;
            const file = `${safeCallId}-${index}.${ext}`;
            writeFileSync(join(dir, file), bytes, { mode: 0o600 });
            refs.push({ file, mimeType: MIME_BY_EXT[ext] });
        });
    }
    catch (err) {
        logger.warn('Could not store tool preview image', err.message);
    }
    return refs;
}
export function readPreviewImage(chatId, file) {
    const dir = chatDir(chatId);
    if (!dir || !SAFE_FILE.test(file))
        return null;
    const ext = file.slice(file.lastIndexOf('.') + 1);
    try {
        return { bytes: readFileSync(join(dir, file)), mimeType: MIME_BY_EXT[ext] ?? 'application/octet-stream' };
    }
    catch {
        return null;
    }
}
export function deletePreviewImages(chatId) {
    const dir = chatDir(chatId);
    if (!dir)
        return;
    try {
        rmSync(dir, { recursive: true, force: true });
    }
    catch (err) {
        logger.warn('Could not delete chat previews', err.message);
    }
}
//# sourceMappingURL=previews.js.map