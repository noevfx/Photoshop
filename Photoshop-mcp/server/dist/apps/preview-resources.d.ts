import type { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
export declare function listPreviewResources(): {
    resources: Array<{
        uri: string;
        name: string;
        title: string;
        description: string;
        mimeType: string;
    }>;
};
export declare function readPreviewResource(uri: string): ReadResourceResult;
//# sourceMappingURL=preview-resources.d.ts.map