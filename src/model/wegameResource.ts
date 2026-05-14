import { storeKeys } from '@src/constants/storeKeys';
import { rocomDefaultConfigData } from '@src/data/rocom/defaults';
import { wegameDefaultConfigData } from '@src/data/wegame/defaults';
import { readRuntimeStore } from '@src/model/runtimeStore';
import { deepMerge } from '@src/model/simpleYaml';

const wegameConfigStoreKey = storeKeys.config.wegameCore;
const wegameConfigStoreFileName = 'config-wegame-core.yaml';
const rocomConfigStoreKey = storeKeys.config.rocom;
const rocomConfigStoreFileName = 'config-rocom.yaml';
const rocomHelpConfigStoreKey = storeKeys.config.rocomHelp;
const rocomHelpConfigStoreFileName = 'config-rocom-help.yaml';

type ConfigStoreBinding = {
  key: string;
  fileName: string;
};
const configStoreBindings = {
  wegameCore: {
    key: wegameConfigStoreKey,
    fileName: wegameConfigStoreFileName
  },
  rocom: {
    key: rocomConfigStoreKey,
    fileName: rocomConfigStoreFileName
  },
  rocomHelp: {
    key: rocomHelpConfigStoreKey,
    fileName: rocomHelpConfigStoreFileName
  }
} as const;

async function readStoredConfig(binding: ConfigStoreBinding): Promise<Record<string, unknown>> {
  return await readRuntimeStore<Record<string, unknown>>(binding.key, binding.fileName, {});
}

export function getWeGameCoreConfigSource(): string {
  return `${wegameConfigStoreKey}（回退：.data/runtime-store/${wegameConfigStoreFileName}）`;
}

export function getRocomConfigSource(): string {
  return `${rocomConfigStoreKey}（回退：.data/runtime-store/${rocomConfigStoreFileName}）`;
}

export async function readWeGameCoreConfig(): Promise<Record<string, unknown>> {
  return deepMerge(wegameDefaultConfigData, await readStoredConfig(configStoreBindings.wegameCore));
}

export async function readRocomConfig(): Promise<Record<string, unknown>> {
  return deepMerge(rocomDefaultConfigData, await readStoredConfig(configStoreBindings.rocom));
}

export async function readRocomHelpConfig(): Promise<Record<string, unknown>> {
  return await readStoredConfig(configStoreBindings.rocomHelp);
}
