import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { PhotoshopConnection } from '../platform/connection.js';
/**
 * Tiny read. Success means Photoshop accepted and finished a script on the
 * same queue as every other tool. `app.documents.length` does not walk layers,
 * so a busy engine fails here instead of inside get_state / get_layers.
 */
export declare const PING_PROBE_SCRIPT = "return app.documents.length;";
export declare function probePhotoshopEngine(connection: PhotoshopConnection): Promise<CallToolResult>;
//# sourceMappingURL=ping-engine.d.ts.map