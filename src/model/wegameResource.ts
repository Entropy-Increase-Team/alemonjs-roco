import { storeKeys } from '@src/constants/storeKeys';
import { rocomDefaultConfigData } from '@src/data/rocom/defaults';
import { wegameDefaultConfigData } from '@src/data/wegame/defaults';
import { readRuntimeStore } from '@src/model/runtimeStore';
import { deepMerge, parseSimpleYaml } from '@src/model/simpleYaml';

const rocomHelpConfigStoreKey = storeKeys.config.rocomHelp;
const rocomHelpConfigStoreFileName = 'config-rocom-help.yaml';
const appConfigNamespace = 'alemonjs-roco';

type ConfigStoreBinding = {
  key: string;
  fileName: string;
};
const configStoreBindings = {
  rocomHelp: {
    key: rocomHelpConfigStoreKey,
    fileName: rocomHelpConfigStoreFileName
  }
} as const;

async function readStoredConfig(binding: ConfigStoreBinding): Promise<Record<string, unknown>> {
  return await readRuntimeStore<Record<string, unknown>>(binding.key, binding.fileName, {});
}

function readAppUserConfig(): Record<string, unknown> {
  const root = parseSimpleYaml('alemon.config.yaml');
  const config = root[appConfigNamespace];

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return {};
  }

  return config as Record<string, unknown>;
}

export function getWeGameCoreConfigSource(): string {
  return `alemon.config.yaml -> ${appConfigNamespace}.wegame`;
}

export function getRocomConfigSource(): string {
  return `alemon.config.yaml -> ${appConfigNamespace}`;
}

export function readWeGameCoreConfig(): Promise<Record<string, unknown>> {
  return Promise.resolve(deepMerge(wegameDefaultConfigData, readAppUserConfig()));
}

export function readRocomConfig(): Promise<Record<string, unknown>> {
  return Promise.resolve(deepMerge(rocomDefaultConfigData, readAppUserConfig()));
}

export async function readRocomHelpConfig(): Promise<Record<string, unknown>> {
  return await readStoredConfig(configStoreBindings.rocomHelp);
}
