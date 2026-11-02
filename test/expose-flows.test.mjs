import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { Expose, logger } from 'alemonjs';
import { createTestApp } from 'alemonjs/testing';
import { rocoExpose } from '../lib/expose/index.js';

function gate() {
  let release;
  const promise = new Promise(resolve => {
    release = resolve;
  });
  return { promise, release };
}
async function until(fn) {
  for (let n = 0; n < 200; n++) {
    const result = await fn();
    if (result) return result;
    await delay(5);
  }
  throw new Error('fixture condition timed out');
}

// Real model HTTP and file-store code runs against an isolated loopback backend/temp cwd.
test('real Expose business flows with isolated backend and persistence', async t => {
  const originalCwd = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), 'roco-expose-'));
  const oldDriver = process.env.ALEMONJS_RUNTIME_STORE_DRIVER;
  const oldLogger = globalThis.logger;
  process.env.ALEMONJS_RUNTIME_STORE_DRIVER = 'file';
  globalThis.logger = logger;
  process.chdir(directory);
  const requests = [];
  const bindings = new Map();
  const qrGates = new Map();
  const statusGates = new Map();
  const loginStatus = new Map();
  const deleteLost = new Set();
  let failSync = false;
  let invalidPage = false;
  let failSyncAfterWrite = false;
  const qrFailures = new Set();
  const posts = [];
  let subscriptions = [{ subscription_id: 's1' }, { subscription_id: 's2' }];
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const user = String(req.headers['x-user-identifier'] ?? url.searchParams.get('user_identifier') ?? '');
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
    requests.push({ method: req.method, path: url.pathname, user, body });
    const send = (data, code = 0) => {
      if (!res.destroyed) {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ code, message: code ? 'fixture rejection' : '', data }));
      }
    };
    if (url.pathname === '/api/v1/user/bindings') {
      if (failSync) {
        failSync = false;
        return send({}, 1);
      }
      return send({ bindings: bindings.get(user) ?? [] });
    }
    const binding = url.pathname.match(/^\/api\/v1\/user\/bindings\/([^/]+)(\/primary)?$/u);
    if (binding) {
      const id = decodeURIComponent(binding[1]);
      const list = bindings.get(user) ?? [];
      if (!list.some(item => item.id === id)) return send({}, 1);
      if (req.method === 'DELETE') {
        bindings.set(
          user,
          list.filter(item => item.id !== id)
        );
        if (deleteLost.delete(id)) return send({}, 1); // backend committed but caller got failure
      } else if (binding[2]) {
        bindings.set(
          user,
          list.map(item => ({ ...item, isPrimary: item.id === id }))
        );
      }
      if (failSyncAfterWrite) {
        failSync = true;
        failSyncAfterWrite = false;
      }
      return send({});
    }
    if (url.pathname.endsWith('/qr')) {
      if (qrFailures.has(user)) return send({}, 1);
      if (qrGates.has(user)) await qrGates.get(user).promise;
      return send({ frameworkToken: `SECRET-${user}`, qr_image: `data:image/png;base64,${Buffer.from(user).toString('base64')}` });
    }
    if (url.pathname.endsWith('/status')) {
      if (statusGates.has(user)) await statusGates.get(user).promise;
      return send({ status: loginStatus.get(user) ?? 'scanned', code: 1 });
    }
    if (url.pathname.endsWith('/token')) {
      bindings.set(user, [{ id: `login-${user}`, frameworkToken: `SECRET-${user}`, nickname: user, isPrimary: true }]);
      return send({ frameworkToken: `SECRET-${user}`, role: { id: '123', name: user } });
    }
    if (url.pathname.endsWith('/merchant/info')) return send({ random_goods: [{ id: 1, goods_name: '国王球', item_id: 12, item_num: 1 }] });
    if (url.pathname.endsWith('/egg-exchanges') && req.method === 'POST') {
      if (body.have_text === 'reject') return send({}, 1);
      const post = { post_id: `p${posts.length + 1}`, ...body, user };
      posts.push(post);
      return send(post);
    }
    if (url.pathname.endsWith('/egg-exchanges') || url.pathname.endsWith('/egg-exchanges/my'))
      return send({ items: posts.filter(item => item.user === user), page_no: invalidPage ? 'invalid' : 1, total_pages: 1 });
    if (url.pathname.endsWith('/egg-exchange-subscriptions') && req.method === 'GET') return send({ subscriptions });
    if (url.pathname.endsWith('/egg-exchange-subscriptions') && req.method === 'POST') {
      const subscription = { subscription_id: `s${subscriptions.length + 1}`, filters: body.filters };
      subscriptions.push(subscription);
      return send({ subscription });
    }
    if (url.pathname.includes('/egg-exchange-subscriptions/') && req.method === 'DELETE') {
      const id = url.pathname.split('/').at(-1);
      if (id === 's2') return send({}, 1);
      subscriptions = subscriptions.filter(item => item.subscription_id !== id);
      return send({});
    }
    return send({}, 1);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const app = createTestApp({
    config: {
      'alemonjs-roco': {
        expose: { allowed_callers: ['caller'] },
        wegame: {
          base_url: `http://127.0.0.1:${server.address().port}`,
          api_key: 'TEST_KEY',
          login_poll_interval_ms: 5,
          login_timeout_ms: 5000,
          request_timeout_ms: 5000
        }
      }
    }
  });
  const client = Expose.create();
  const event = (user, group, bot = 'bot-a') =>
    group
      ? app.events.groupMessage({ platform: 'qq-bot', userId: user, groupId: group, botId: bot })
      : app.events.privateMessage({ platform: 'qq-bot', userId: user, botId: bot });
  const call = async (action, input = {}, { user = 'alice', group, bot, timeoutMs, signal } = {}) => {
    const options = { ...(timeoutMs ? { timeoutMs } : {}), ...(signal ? { signal } : {}) };
    const result = await app.invoke(event(user, group, bot), () => client.call('roco', 'alemonjs-roco', action, input, options), 'caller');
    assert.equal(result.actions.length, 0);
    assert.equal(JSON.stringify(result.value).includes('SECRET-'), false, 'credential must never escape');
    return result.value;
  };
  const success = result => {
    assert.equal(result.ok, true, JSON.stringify(result));
    return result.data;
  };
  try {
    await app.mount({ expose: rocoExpose }, {}, 'alemonjs-roco');
    await t.test('binding IDs survive reorder, retries after committed deletion cannot delete another account', async () => {
      bindings.set('alice', [
        { id: 'a', frameworkToken: 'SECRET-a', nickname: 'A' },
        { id: 'b', frameworkToken: 'SECRET-b', nickname: 'B' }
      ]);
      const list = success(await call('get_bindings')).data.bindings;
      assert.deepEqual(
        list.map(item => item.id),
        ['a', 'b']
      );
      bindings.set('alice', bindings.get('alice').reverse());
      success(await call('switch_binding', { bindingId: 'a' }));
      assert.equal(bindings.get('alice').find(item => item.id === 'a').isPrimary, true);
      assert.equal((await call('switch_binding', { bindingId: 'foreign' })).error.code, 'FORBIDDEN');
      deleteLost.add('a');
      assert.equal((await call('delete_binding', { bindingId: 'a' })).ok, false);
      const retry = success(await call('delete_binding', { bindingId: 'a' })).data;
      assert.equal(retry.outcome, 'absent');
      assert.deepEqual(
        bindings.get('alice').map(item => item.id),
        ['b']
      );
      assert.equal(requests.filter(item => item.method === 'DELETE' && item.path.endsWith('/a')).length, 1);
      assert.equal((await call('delete_binding', { index: 1 })).error.code, 'INVALID_INPUT');
      assert.equal(success(await call('delete_binding', { bindingId: 'foreign' })).data.outcome, 'absent');
    });
    await t.test('successful mutation and failed cache sync reports partial without repeating delete', async () => {
      bindings.set('sync-user', [{ id: 'sync-a', frameworkToken: 'SECRET-sync' }]);
      failSyncAfterWrite = true;
      const result = success(await call('delete_binding', { bindingId: 'sync-a' }, { user: 'sync-user' }));
      assert.equal(result.status, 'partial');
      assert.equal(result.data.outcome, 'deleted');
      assert.equal(result.data.synced, false);
      assert.equal(success(await call('delete_binding', { bindingId: 'sync-a' }, { user: 'sync-user' })).data.outcome, 'absent');
      assert.equal(requests.filter(item => item.method === 'DELETE' && item.path.endsWith('/sync-a')).length, 1);
    });
    await t.test('QR creation timeout and concurrent retry recover the same owned session', async () => {
      const hold = gate();
      qrGates.set('login-user', hold);
      const timed = await call('start_login', { platform: 'qq' }, { user: 'login-user', timeoutMs: 30 });
      assert.equal(timed.error.code, 'TIMEOUT');
      const pending = success(await call('get_login_session', {}, { user: 'login-user' })).data;
      assert.equal(pending.state, 'starting');
      const retried = success(await call('start_login', { platform: 'qq' }, { user: 'login-user' })).data;
      assert.equal(retried.sessionId, pending.sessionId);
      assert.equal((await call('wait_login', { sessionId: pending.sessionId }, { user: 'other-user' })).error.code, 'FORBIDDEN');
      hold.release();
      const ready = await until(async () => {
        const result = success(await call('get_login_session', {}, { user: 'login-user' })).data;
        return result.state === 'ready' && result;
      });
      assert.ok(ready.qrImage.startsWith('data:image/'));
      assert.equal(ready.sessionId, pending.sessionId);
      assert.equal(requests.filter(item => item.user === 'login-user' && item.path.endsWith('/qr')).length, 1);
    });
    await t.test('waiting timeout continues one poller and retains successful login outcome', async () => {
      const user = 'login-user';
      const session = success(await call('get_login_session', {}, { user })).data;
      const hold = gate();
      statusGates.set(user, hold);
      loginStatus.set(user, 'done');
      assert.equal((await call('wait_login', { sessionId: session.sessionId }, { user, timeoutMs: 30 })).error.code, 'TIMEOUT');
      const duplicate = call('wait_login', { sessionId: session.sessionId }, { user });
      hold.release();
      assert.equal(success(await duplicate).data.state, 'completed');
      assert.equal(success(await call('wait_login', { sessionId: session.sessionId }, { user })).data.state, 'completed');
      assert.equal(success(await call('get_login_session', {}, { user })).data.state, 'completed');
      assert.equal(requests.filter(item => item.user === user && item.path.endsWith('/token')).length, 1);
      const store = JSON.parse(await readFile('.data/runtime-store/wegame-users.json', 'utf8'));
      assert.equal(store.users['qq-bot:bot-a:login-user'].lastCredential.role.id, '123');
      assert.equal(success(await call('get_bindings', {}, { user })).data.bindings[0].id, `login-${user}`);
    });
    await t.test('cancel stops polling, rejects foreign users and allows a fresh session', async () => {
      const user = 'cancel-user';
      const ready = success(await call('start_login', { platform: 'wechat' }, { user })).data;
      const hold = gate();
      statusGates.set(user, hold);
      loginStatus.set(user, 'done');
      const waiting = call('wait_login', { sessionId: ready.sessionId }, { user });
      await until(() => requests.some(item => item.user === user && item.path.endsWith('/status')));
      assert.equal((await call('cancel_login', { sessionId: ready.sessionId }, { user: 'other-user' })).error.code, 'FORBIDDEN');
      assert.equal(success(await call('cancel_login', { sessionId: ready.sessionId }, { user })).data.state, 'cancelled');
      assert.equal(success(await waiting).data.state, 'cancelled');
      hold.release();
      assert.equal(requests.filter(item => item.user === user && item.path.endsWith('/token')).length, 0);
      const fresh = success(await call('start_login', { platform: 'wechat' }, { user })).data;
      assert.notEqual(fresh.sessionId, ready.sessionId);
      await call('cancel_login', { sessionId: fresh.sessionId }, { user });
    });
    await t.test('failed QR creation and expired sessions are recoverable without leaking tokens', async () => {
      const user = 'failure-user';
      qrFailures.add(user);
      assert.equal(success(await call('start_login', { platform: 'qq' }, { user })).data.state, 'failed');
      assert.equal(success(await call('get_login_session', {}, { user })).data.state, 'failed');
      qrFailures.delete(user);
      const ready = success(await call('start_login', { platform: 'qq' }, { user })).data;
      assert.equal(ready.state, 'ready');
      assert.equal((await call('start_login', { platform: 'wechat' }, { user })).error.code, 'INVALID_INPUT');
      const realNow = Date.now;
      const clock = t.mock.method(Date, 'now', () => ready.expiresAt + 1);
      try {
        assert.equal(success(await call('get_login_session', {}, { user })).data.state, 'expired');
      } finally {
        clock.mock.restore();
      }
      assert.equal(Date.now, realNow);
      assert.equal(success(await call('start_login', { platform: 'wechat' }, { user })).data.state, 'ready');
    });
    await t.test('cancelling an in-flight QR request cannot resurrect the session', async () => {
      const user = 'cancel-start';
      const hold = gate();
      qrGates.set(user, hold);
      const starting = call('start_login', { platform: 'qq' }, { user });
      await until(() => requests.some(item => item.user === user && item.path.endsWith('/qr')));
      const snapshot = success(await call('get_login_session', {}, { user })).data;
      assert.equal(snapshot.state, 'starting');
      assert.equal(success(await call('cancel_login', { sessionId: snapshot.sessionId }, { user })).data.state, 'cancelled');
      hold.release();
      assert.equal(success(await starting).data.state, 'cancelled');
      assert.equal(success(await call('get_login_session', {}, { user })).data.qrImage, '');
      qrGates.delete(user);
      const fresh = success(await call('start_login', { platform: 'qq' }, { user })).data;
      assert.notEqual(fresh.sessionId, snapshot.sessionId);
    });
    await t.test('real post and subscription writes expose success, backend rejection and partial deletion', async () => {
      const posted = success(await call('post_egg_exchange', { have: '火花', want: '水蓝蓝' })).data;
      assert.equal(posted.postId, 'p1');
      const list = success(await call('get_my_egg_exchanges')).data.items;
      assert.equal(list[0].have, '火花');
      assert.equal((await call('post_egg_exchange', { have: 'reject', want: '水蓝蓝' })).ok, false);
      const subscribed = success(await call('subscribe_egg_exchange', { want_text: '火花' })).data;
      assert.equal(subscribed.subscriptionId, 's3');
      assert.equal(success(await call('get_egg_subscriptions')).data.subscriptions.find(item => item.id === 's3').filters.want_text, '火花');
      const partial = success(await call('unsubscribe_egg_exchange'));
      assert.equal(partial.status, 'partial');
      assert.deepEqual(partial.removed, ['s1', 's3']);
      assert.deepEqual(partial.failed, ['s2']);
      assert.equal(success(await call('unsubscribe_egg_exchange')).status, 'rejected');
      assert.equal(requests.find(item => item.path.endsWith('/egg-exchanges') && item.method === 'POST').user, 'alice');
    });
    await t.test('typed output rejects malformed backend pagination', async () => {
      invalidPage = true;
      try {
        assert.equal((await call('get_egg_exchanges')).error.code, 'INVALID_OUTPUT');
      } finally {
        invalidPage = false;
      }
      assert.equal(success(await call('get_egg_exchanges')).data.page, 1);
    });
    await t.test('already-aborted write calls cannot reach the backend', async () => {
      const controller = new AbortController();
      controller.abort();
      const before = requests.length;
      const result = await call('post_egg_exchange', { have: 'a', want: 'b' }, { signal: controller.signal });
      assert.equal(result.error.code, 'ABORTED');
      assert.equal(result.error.outcome, 'not_started');
      assert.equal(requests.length, before);
    });
    await t.test('merchant invalid selection is rejected without write; mixed selection reports partial', async () => {
      const rejected = await call('subscribe_merchant', { items: ['999'] }, { group: 'g1' });
      assert.equal(rejected.ok, false);
      assert.equal(rejected.error.code, 'INVALID_INPUT');
      await assert.rejects(readFile('.data/runtime-store/rocom-merchant-subscriptions.json', 'utf8'), { code: 'ENOENT' });
      const mixed = success(await call('subscribe_merchant', { items: ['1', '999'] }, { group: 'g1' }));
      assert.equal(mixed.status, 'partial');
      assert.deepEqual(mixed.items, ['国王球']);
      assert.deepEqual(mixed.unknownIndexes, ['999']);
      const stored = JSON.parse(await readFile('.data/runtime-store/rocom-merchant-subscriptions.json', 'utf8'));
      assert.deepEqual(stored['bot-a:g1'].items, ['国王球']);
      success(await call('subscribe_merchant', { items: ['1'] }, { group: 'g2' }));
      success(await call('unsubscribe_merchant', {}, { group: 'g1' }));
      const remaining = JSON.parse(await readFile('.data/runtime-store/rocom-merchant-subscriptions.json', 'utf8'));
      assert.equal(remaining['bot-a:g1'], undefined);
      assert.ok(remaining['bot-a:g2']);
    });
    await t.test('home subscription persistence is isolated by group, bot and private user', async () => {
      for (const options of [{ group: 'g1' }, { group: 'g2' }, { group: 'g1', bot: 'bot-b' }, { user: 'alice' }, { user: 'bob' }]) {
        success(await call('subscribe_home', { uid: '123' }, options));
      }
      success(await call('unsubscribe_home', {}, { group: 'g1' }));
      assert.equal(success(await call('get_home_subscriptions', {}, { group: 'g1' })).data.subscriptions.length, 0);
      for (const options of [{ group: 'g2' }, { group: 'g1', bot: 'bot-b' }, { user: 'alice' }, { user: 'bob' }]) {
        assert.equal(success(await call('get_home_subscriptions', {}, options)).data.subscriptions.length, 1);
      }
      assert.equal((await call('get_home_subscriptions', { userId: 'bob' })).error.code, 'INVALID_INPUT');
    });
  } finally {
    for (const item of [...qrGates.values(), ...statusGates.values()]) item.release();
    await app.dispose();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    process.chdir(originalCwd);
    await rm(directory, { recursive: true, force: true });
    if (oldDriver === undefined) delete process.env.ALEMONJS_RUNTIME_STORE_DRIVER;
    else process.env.ALEMONJS_RUNTIME_STORE_DRIVER = oldDriver;
    globalThis.logger = oldLogger;
  }
});
