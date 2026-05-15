import { getConfigValue } from 'alemonjs';
import { rocomDefaultConfigData } from '@src/data/rocom/defaults';
import { wegameDefaultConfigData } from '@src/data/wegame/defaults';
import { deepMerge } from '@src/model/simpleYaml';
const appConfigNamespace = 'alemonjs-roco';

function readAppUserConfig(): Record<string, unknown> {
  const root = getConfigValue<Record<string, unknown>>();
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

export function readRocomHelpConfig(): Promise<Record<string, unknown>> {
  const appConfig = readAppUserConfig();
  const rocomHelpConfig = appConfig.rocom_help ?? appConfig.rocomHelp;

  if (!rocomHelpConfig || typeof rocomHelpConfig !== 'object' || Array.isArray(rocomHelpConfig)) {
    return Promise.resolve({});
  }

  return Promise.resolve(rocomHelpConfig as Record<string, unknown>);
}
