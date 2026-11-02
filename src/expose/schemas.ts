import { array, record, strings, stringSchema as str, numberSchema as num, booleanSchema as bool } from './shared';
import type { Pet } from '../model/types';

export const skillSchema = record({ ...strings('name', 'element', 'type', 'desc'), cost: num, power: num });
export const petSchema = record({
  ...strings('name', 'avatar'),
  id: num,
  elements: array(str),
  hp: num,
  atk: num,
  mat: num,
  def: num,
  mdf: num,
  spd: num,
  trait: record(strings('name', 'desc')),
  skills: array(skillSchema)
});
export function projectPet(pet: Pet) {
  return {
    id: pet.id,
    name: pet.name,
    avatar: pet.avatar ?? '',
    elements: Array.isArray(pet.element) ? pet.element : [pet.element],
    hp: pet.hp,
    atk: pet.atk,
    mat: pet.mat,
    def: pet.def,
    mdf: pet.mdf,
    spd: pet.spd,
    trait: pet.trait,
    skills: pet.skills
  };
}
const homePet = record({
  ...strings('id', 'name', 'level', 'iconUrl', 'fallbackIconUrl', 'starIconUrl', 'genderText', 'weightText', 'voiceText', 'variantText', 'eggText'),
  eggReady: bool
});

export const homePetsSchema = record({
  ...strings('title', 'subtitle', 'homeName', 'uid', 'emptyText', 'updatedAt'),
  pets: array(homePet),
  total: num,
  eggCount: num
});
const homeSkill = record({ ...strings('name', 'cost', 'power', 'families', 'iconUrl', 'fallbackIconUrl', 'typeColor'), id: num, pos: num });

// Project semantic detail fields; nullable decorations from the image card are intentionally omitted.
export const homeDetailPetSchema = record({
  ...strings(
    'status',
    'petId',
    'petGid',
    'npcId',
    'name',
    'defaultName',
    'level',
    'genderText',
    'natureText',
    'voiceText',
    'bloodText',
    'variantText',
    'errorText'
  ),
  attributes: array(record({ label: str, value: num, talent: num, effort: num })),
  equipSkills: array(homeSkill),
  learnedSkills: array(homeSkill)
});
export const homeDetailSchema = record({ uid: str, pets: array(homeDetailPetSchema), updatedAt: str });
export const teamSchema = record({
  ...strings('share_code', 'mode_name', 'magic_icon', 'count_label'),
  sprite_count: num,
  teams: array(
    record({
      slot: num,
      ...strings('slotText', 'color'),
      pet: record(strings('id', 'name', 'icon')),
      typeIcons: array(record(strings('name'))),
      bloodline: record(strings('name', 'element', 'icon')),
      personality: record(strings('id', 'name', 'up', 'down')),
      ivs_detail: array(record(strings('name'))),
      skills: array(record(strings('name', 'icon')))
    })
  )
});
const goods = record({
  ...strings('goodsName', 'iconUrl', 'category', 'remainingStr', 'timeLabel'),
  price: num,
  limit: num,
  roundId: num,
  isHot: bool,
  isEnded: bool
});

export const merchantTodaySchema = record({
  ...strings('title', 'subtitle', 'dateStr', 'currentRoundLabel', 'currentCountdown'),
  totalProducts: num,
  rows: array(record({ roundId: num, ...strings('label', 'timeLabel'), isCurrent: bool, items: array(goods) }))
});
export const catalogSchema = array(record({ index: num, name: str, goods_id: num, item_id: num, item_num: num }));
export const announcementSchema = record({ id: num, ...strings('title', 'date', 'category') });
export const announcementDetailSchema = record({ id: num, ...strings('title', 'date', 'author', 'content', 'coverUrl', 'tagIds') });
export const eggPostSchema = record(strings('id', 'have', 'want', 'note', 'remark', 'status', 'reviewStatus', 'createdAt'));
export function projectPost(item: Record<string, unknown>) {
  return {
    id: String(item.post_id ?? item.id ?? ''),
    have: String(item.have_text ?? ''),
    want: String(item.want_text ?? ''),
    note: String(item.want_note ?? ''),
    remark: String(item.remark ?? ''),
    status: String(item.status ?? ''),
    reviewStatus: String(item.review_status ?? ''),
    createdAt: String(item.created_at ?? '')
  };
}
export const eggFiltersSchema = record(strings('want_text', 'have_text', 'want_note', 'id', 'q'));
export function projectFilters(value: unknown) {
  const data = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

  return {
    want_text: String(data.want_text ?? ''),
    have_text: String(data.have_text ?? ''),
    want_note: String(data.want_note ?? ''),
    id: String(data.id ?? ''),
    q: String(data.q ?? '')
  };
}
export const homeSubscriptionSchema = record({
  ...strings('target_type', 'bot_id', 'group_id', 'user_id', 'target_uid', 'last_push_time', 'last_check_time', 'updated_at'),
  mention_all: bool,
  last_egg_count: num,
  last_pushed_egg_count: num
});
