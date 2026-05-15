const appName = 'alemonjs-roco';
const dataPrefix = `data:${appName}`;

export type StoreKeyFormat = 'json' | 'yaml';

function normalizeSegments(segments: string[]): string[] {
  return segments.map(item => String(item).trim()).filter(Boolean);
}

export function buildDataStoreKey(format: StoreKeyFormat, ...segments: string[]): string {
  const suffix = normalizeSegments(segments).join(':');

  return suffix ? `${dataPrefix}:${suffix}.${format}` : `${dataPrefix}.${format}`;
}

export function getStoreKeyFormat(key: string): StoreKeyFormat {
  return key.endsWith('.yaml') ? 'yaml' : 'json';
}

export const storeKeys = {
  config: {
    wegameCore: buildDataStoreKey('yaml', 'config', 'wegame-core'),
    rocom: buildDataStoreKey('yaml', 'config', 'rocom'),
    rocomHelp: buildDataStoreKey('yaml', 'config', 'rocom-help')
  },
  wegame: {
    users: buildDataStoreKey('json', 'wegame', 'users')
  },
  rocom: {
    merchantSubscriptions: buildDataStoreKey('json', 'rocom', 'merchant-subscriptions')
  }
} as const;
