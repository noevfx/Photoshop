import { Logger } from '../utils/logger.js';
import { capture, captureAnalyticsMilestoneOnce, identifyPhotoshopVersion } from '../analytics/index.js';
import { PhotoshopConnection } from '../platform/connection.js';
export class Session {
    logger;
    connection;
    config;
    isConnected = false;
    lastActivity;
    constructor(config = {}) {
        this.logger = new Logger('Session');
        this.connection = new PhotoshopConnection();
        this.config = {
            autoConnect: true,
            reconnectAttempts: 3,
            reconnectDelay: 1000,
            ...config,
        };
        this.lastActivity = new Date();
    }
    async initialize() {
        this.logger.info('Initializing session...');
        this.connection.setOnFreshDetect((ok) => {
            this.isConnected = ok;
            if (ok) {
                this.updateActivity();
                void this.refreshPhotoshopVersionOnPerson();
            }
            this.captureConnectionEvent(ok);
        });
        if (!this.config.autoConnect)
            return;
        if (this.connection.hydrateFromCache()) {
            this.isConnected = true;
            this.updateActivity();
            this.logger.info('Using cached Photoshop detection');
            void this.refreshPhotoshopVersionOnPerson();
            return;
        }
        this.logger.debug('Photoshop detection deferred until first tool');
    }
    async connect() {
        try {
            this.logger.info('Connecting to Photoshop...');
            const connected = await this.connection.ping();
            this.isConnected = connected;
            if (connected) {
                this.updateActivity();
                this.logger.info('Successfully connected to Photoshop');
                void this.refreshPhotoshopVersionOnPerson();
                return true;
            }
            this.logger.warn('Failed to connect to Photoshop');
            return false;
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            this.isConnected = false;
            return false;
        }
    }
    async reconnect() {
        this.logger.info('Attempting to reconnect...');
        for (let attempt = 1; attempt <= (this.config.reconnectAttempts || 3); attempt++) {
            this.logger.debug(`Reconnect attempt ${attempt}/${this.config.reconnectAttempts}`);
            const connected = await this.connect();
            if (connected) {
                return true;
            }
            if (attempt < (this.config.reconnectAttempts || 3)) {
                await this.delay(this.config.reconnectDelay || 1000);
            }
        }
        this.logger.error('Failed to reconnect after all attempts');
        this.captureConnectionEvent(false);
        return false;
    }
    async disconnect() {
        this.logger.info('Disconnecting session...');
        this.isConnected = false;
    }
    getConnection() {
        return this.connection;
    }
    getConnectionStatus() {
        return this.isConnected;
    }
    getLastActivity() {
        return this.lastActivity;
    }
    updateActivity() {
        this.lastActivity = new Date();
    }
    captureConnectionEvent(connected) {
        capture('mcp_photoshop_connection', {
            ok: connected,
            photoshop_connected: connected,
            ...(connected ? {} : { error_code: 'photoshop_unreachable' }),
            event_source: 'mcp',
        });
        if (connected) {
            captureAnalyticsMilestoneOnce('mcp_photoshop_first_connected', {
                event_source: 'mcp',
            });
        }
    }
    async refreshPhotoshopVersionOnPerson() {
        try {
            const version = await this.connection.getVersion();
            identifyPhotoshopVersion(version);
        }
        catch {
            // Best-effort person enrichment only.
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=session.js.map