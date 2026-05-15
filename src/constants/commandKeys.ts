const baseCommandPrefixes = ['#', '＃', '/'] as const;
const plusCommandPrefix = '+' as const;

const wegameNamespaces = ['wg'] as const;
const rocoNamespaces = ['roco', '洛克', '洛克王国', '洛克王国世界', '洛克世界'] as const;

function buildNamespacedPrefixes(basePrefixes: readonly string[], namespaces: readonly string[]) {
  return basePrefixes.flatMap(prefix => namespaces.map(namespace => `${prefix}${namespace}`));
}

export const commandKeyConfig = {
  basePrefixes: [...baseCommandPrefixes],
  plusPrefix: plusCommandPrefix,
  wegameNamespaces: [...wegameNamespaces],
  rocoNamespaces: [...rocoNamespaces],
  wegamePrefixes: buildNamespacedPrefixes(baseCommandPrefixes, wegameNamespaces),
  rocoPrefixes: buildNamespacedPrefixes(baseCommandPrefixes, rocoNamespaces),
  rocomPrefixes: [plusCommandPrefix, ...buildNamespacedPrefixes(baseCommandPrefixes, rocoNamespaces)]
} as const;
