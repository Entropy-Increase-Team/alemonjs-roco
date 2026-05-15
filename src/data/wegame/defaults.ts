import wegameDefaultConfig from './wgconfig_default.yaml';
import wegameHelpDefaultConfig from './help_default.yaml';
import { parseImportedYamlResource } from '@src/model/simpleYaml';

export const wegameDefaultConfigData = parseImportedYamlResource<Record<string, unknown>>(wegameDefaultConfig);
export const wegameHelpDefaultConfigData = parseImportedYamlResource<Record<string, unknown>>(wegameHelpDefaultConfig);
