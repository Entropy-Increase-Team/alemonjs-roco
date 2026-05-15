import { rocomDefaultConfigData } from '../data/rocom/defaults.js';
import { wegameDefaultConfigData } from '../data/wegame/defaults.js';
import { deepMerge, parseSimpleYaml } from './simpleYaml.js';

const appConfigNamespace = 'alemonjs-roco';
function readAppUserConfig() {
    const root = parseSimpleYaml('alemon.config.yaml');
    const config = root[appConfigNamespace];
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        return {};
    }
    return config;
}
function getWeGameCoreConfigSource() {
    return `alemon.config.yaml -> ${appConfigNamespace}.wegame`;
}
function getRocomConfigSource() {
    return `alemon.config.yaml -> ${appConfigNamespace}`;
}
function readWeGameCoreConfig() {
    return Promise.resolve(deepMerge(wegameDefaultConfigData, readAppUserConfig()));
}
function readRocomConfig() {
    return Promise.resolve(deepMerge(rocomDefaultConfigData, readAppUserConfig()));
}
function readRocomHelpConfig() {
    const appConfig = readAppUserConfig();
    const rocomHelpConfig = appConfig.rocom_help ?? appConfig.rocomHelp;
    if (!rocomHelpConfig || typeof rocomHelpConfig !== 'object' || Array.isArray(rocomHelpConfig)) {
        return Promise.resolve({});
    }
    return Promise.resolve(rocomHelpConfig);
}

export { getRocomConfigSource, getWeGameCoreConfigSource, readRocomConfig, readRocomHelpConfig, readWeGameCoreConfig };
