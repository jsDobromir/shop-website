import path from 'path';

export const moduleUrl = new URL(import.meta.url);
export const __dirname = path.dirname(moduleUrl.hostname);

