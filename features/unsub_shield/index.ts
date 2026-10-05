import type { App } from '@slack/bolt';
import listener from './listener.js';
import command from './command.js';

function register(app: App) {
    app.command(/\/(.*dev-)?unsub-opt-out$/, command);
}

export { register, listener as messageListener };
