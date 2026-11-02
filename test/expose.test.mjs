import test from 'node:test';
import assert from 'node:assert/strict';
import { Expose } from 'alemonjs';
import { createTestApp } from 'alemonjs/testing';
import { rocoExpose } from '../lib/expose/index.js';

const expectedWrites = [
  'bind_uid',
  'post_egg_exchange',
  'close_egg_exchange',
  'subscribe_egg_exchange',
  'unsubscribe_egg_exchange',
  'update_plugin',
  'force_update_plugin',
  'start_login',
  'wait_login',
  'cancel_login',
  'switch_binding',
  'delete_binding',
  'subscribe_merchant',
  'unsubscribe_merchant',
  'subscribe_home',
  'unsubscribe_home'
];

test('Expose uses real plugin/event context, validates contracts and denies unauthorized operations', async () => {
  const app = createTestApp({ config: { 'alemonjs-roco': { expose: { allowed_callers: ['test-caller'] } } } });
  try {
    await app.mount({ expose: rocoExpose }, {}, 'alemonjs-roco');
    const client = Expose.create();
    const event = app.events.privateMessage({}, { Platform: 'qq-bot', BotId: 'test-bot', UserId: 'test-user' });
    const call = async (action, input, caller = 'test-caller', source = event) => {
      const result = await app.invoke(source, () => client.call('roco', 'alemonjs-roco', action, input), caller);
      assert.equal(result.actions.length, 0, 'Expose must not send platform messages');
      return result.value;
    };
    const config = rocoExpose.getConfigs()[0];
    assert.equal(Object.keys(config.actions).length, 54);
    for (const [name, action] of Object.entries(config.actions)) {
      assert.ok(action.inputSchema, name);
      assert.ok(action.outputSchema, name);
      assert.equal(action.effect, expectedWrites.includes(name) ? 'write' : 'read', name);
    }
    const pets = await call('list_pet_wiki', {});
    assert.equal(pets.ok, true);
    const list = pets.data.data;
    assert.ok(list.total > 20);
    assert.equal(list.pets.length, 20);
    const pet = await call('find_pet', { keyword: list.pets[0].name });
    assert.equal(pet.ok, true);
    assert.equal(pet.data.data.pets[0].name, list.pets[0].name);
    for (const [action, input] of [
      ['get_profile', { userId: 'someone-else' }],
      ['get_record', { page: 0 }],
      ['post_egg_exchange', { have: 'a' }],
      ['bind_uid', { uid: 'not-a-uid' }],
      ['find_skill', { keyword: '   ' }],
      ['subscribe_egg_exchange', {}],
      ['start_login', { platform: 'invalid' }]
    ]) {
      const result = await call(action, input);
      assert.equal(result.ok, false, action);
      assert.equal(result.error.code, 'INVALID_INPUT', action);
    }
    for (const [action, input] of [
      ['get_config', {}],
      ['update_plugin', {}],
      ['force_update_plugin', { confirm: true }],
      ['wait_login', { sessionId: 'foreign-session' }]
    ]) {
      const result = await call(action, input);
      assert.equal(result.ok, false, action);
      assert.equal(result.error.code, 'FORBIDDEN', action);
    }
    assert.equal((await call('list_pet_wiki', {}, 'other-plugin')).error.code, 'FORBIDDEN');
    assert.equal((await call('list_pet_wiki', {}, 'test-caller', { ...event, UserId: '' })).error.code, 'FORBIDDEN');
    for (const expose of [{ enabled: false }, { allowed_callers: [] }, { allowed_callers: 'test-caller' }]) {
      app.configure({ 'alemonjs-roco': { expose } });
      assert.equal((await call('list_pet_wiki', {})).error.code, 'FORBIDDEN');
    }
  } finally {
    await app.dispose();
  }
});

test('every current command handler has an Expose mapping', async () => {
  const { readFile } = await import('node:fs/promises');
  const router = await readFile(new URL('../src/router.ts', import.meta.url), 'utf8');
  const coverage = JSON.parse(await readFile(new URL('./expose-coverage.json', import.meta.url), 'utf8'));
  const handlers = [...new Set([...router.matchAll(/@src\/response\/([A-Za-z]+)/gu)].map(match => match[1]))].sort();
  assert.deepEqual(Object.keys(coverage).sort(), handlers);
  const actions = rocoExpose.getConfigs()[0].actions;
  for (const [handler, names] of Object.entries(coverage)) {
    assert.ok(names.length, handler);
    for (const name of names) assert.ok(actions[name], `${handler}: ${name}`);
  }
  assert.deepEqual([...new Set(Object.values(coverage).flat())].sort(), Object.keys(actions).sort());
});

test('configuration redaction happens before formatting, including multiline secrets', async () => {
  const { buildWeGameConfigSummary } = await import('../lib/model/wegameConfig.js');
  const app = createTestApp({
    config: { 'alemonjs-roco': { wegame: { api_key: 'TEST_ONLY_SECRET\nSECOND_LINE', device_fingerprint: 'TEST_FINGERPRINT', client_id: 'TEST_CLIENT' } } }
  });
  try {
    const result = await app.run(() => buildWeGameConfigSummary('wegame-core', true));
    assert.ok(result.includes('[已隐藏]'));
    for (const secret of ['TEST_ONLY_SECRET', 'SECOND_LINE', 'TEST_FINGERPRINT', 'TEST_CLIENT']) assert.equal(result.includes(secret), false);
  } finally {
    await app.dispose();
  }
});

test('admin configuration uses redacted Expose output and force update rejects false confirmation', async () => {
  const app = createTestApp({
    config: { master_id: ['admin'], 'alemonjs-roco': { expose: { allowed_callers: ['caller'] }, wegame: { api_key: 'TEST_ADMIN_SECRET' } } }
  });
  try {
    await app.mount({ expose: rocoExpose }, {}, 'alemonjs-roco');
    const client = Expose.create();
    const event = app.events.privateMessage({ platform: 'qq-bot', userId: 'admin', botId: 'test-bot' });
    const configured = await app.invoke(event, () => client.call('roco', 'alemonjs-roco', 'get_config', { code: 'wegame-core' }), 'caller');
    assert.equal(configured.value.ok, true);
    assert.equal(JSON.stringify(configured.value).includes('TEST_ADMIN_SECRET'), false);
    assert.ok(configured.value.data.text.includes('[已隐藏]'));
    const denied = await app.invoke(event, () => client.call('roco', 'alemonjs-roco', 'force_update_plugin', { confirm: false }), 'caller');
    assert.equal(denied.value.ok, false);
    assert.equal(denied.value.error.code, 'INVALID_INPUT');
  } finally {
    await app.dispose();
  }
});
