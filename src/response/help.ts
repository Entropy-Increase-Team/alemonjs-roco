import ALemonJSHelpCard from '@src/img/views/Help';
import WeGameHelpCard from '@src/img/views/WeGameHelp';
import { buildRocoMainHelpText, buildRocoWikiHelpText, getRocoMainHelpCardData, getRocoWikiHelpCardData } from '@src/model/rocom';
import {
  buildWeGameHelpText,
  buildWeGameInstalledModuleHintText,
  getWeGameHelpCardData as getWeGameStandaloneHelpCardData,
  hasInstalledWeGameModules
} from '@src/model/wegame';
import { Format, useMessage, useRoute } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [route] = useRoute();
  const [message] = useMessage();
  const routeKey = String(route.key ?? '').trim();
  const isWeGameHelp = routeKey.startsWith('wg');

  if (isWeGameHelp && hasInstalledWeGameModules()) {
    const format = Format.create();
    const md = Format.createMarkdown();

    md.addText(buildWeGameInstalledModuleHintText());
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  let data;
  let component = ALemonJSHelpCard;

  if (isWeGameHelp) {
    data = getWeGameStandaloneHelpCardData();
    component = WeGameHelpCard;
  } else if (routeKey.startsWith('roco')) {
    data = await getRocoWikiHelpCardData();
  } else {
    data = await getRocoMainHelpCardData();
  }

  const img = await renderComponentIsHtmlToBuffer(component, {
    data
  });

  if (typeof img === 'boolean') {
    const format = Format.create();
    const md = Format.createMarkdown();

    if (isWeGameHelp) {
      md.addText(buildWeGameHelpText());
    } else if (routeKey.startsWith('roco')) {
      md.addText(await buildRocoWikiHelpText());
    } else {
      md.addText(await buildRocoMainHelpText());
    }
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const format = Format.create();

  format.addImage(img);
  void message.send({ format });
};
