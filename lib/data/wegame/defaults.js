import fileUrl from './wgconfig_default.yaml.js';
import fileUrl$1 from './help_default.yaml.js';
import { parseImportedYamlResource } from '../../model/simpleYaml.js';

const wegameDefaultConfigData = parseImportedYamlResource(fileUrl);
const wegameHelpDefaultConfigData = parseImportedYamlResource(fileUrl$1);

export { wegameDefaultConfigData, wegameHelpDefaultConfigData };
