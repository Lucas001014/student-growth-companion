import { createClient, RedisClientType } from 'redis';
import config from '../config';

class RedisManager {
  private client: RedisClientType | null = null;
  private connected = false;

  async getClient(): Promise<RedisClientType> {
    if (this.client && this.connected) return this.client;
    try {
      this.client = createClient({ url: config.redis.url }) as RedisClientType;
      this.client.on('error', (err) => {
        console.error('[Redis] 错误:', err.message);
        this.connected = false;
      });
      this.client.on('connect', () => {
        console.log('[Redis] 已连接');
        this.connected = true;
      });
      await this.client.connect();
      this.connected = true;
      return this.client;
    } catch (err) {
      console.warn('[Redis] 连接失败，降级到内存存储:', (err as Error).message);
      this.connected = false;
      return null as any;
    }
  }

  async get(key: string): Promise<string | null> {
    const c = await this.getClient();
    if (!c) return this.memoryGet(key);
    try { return await c.get(key); } catch { return this.memoryGet(key); }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const c = await this.getClient();
    if (!c) { this.memorySet(key, value, ttl); return; }
    try {
      if (ttl) await c.setEx(key, ttl, value);
      else await c.set(key, value);
    } catch { this.memorySet(key, value, ttl); }
  }

  async zAdd(key: string, score: number, member: string): Promise<void> {
    const c = await this.getClient();
    if (!c) { this.memoryZAdd(key, score, member); return; }
    try { await c.zAdd(key, { score, value: member }); } catch { this.memoryZAdd(key, score, member); }
  }

  async zRevRange(key: string, start = 0, stop = -1, withScores = true): Promise<any[]> {
    const c = await this.getClient();
    if (!c) return this.memoryZRevRange(key, start, stop, withScores);
    try {
      if (withScores) {
        const res = await c.zRangeWithScores(key, start, stop, { REV: true });
        return res.map((r) => ({ member: r.value, score: r.score }));
      }
      const res = await c.zRange(key, start, stop, { REV: true });
      return res;
    } catch { return this.memoryZRevRange(key, start, stop, withScores); }
  }

  async zScore(key: string, member: string): Promise<number | null> {
    const c = await this.getClient();
    if (!c) return this.memoryZScore(key, member);
    try { return await c.zScore(key, member); } catch { return this.memoryZScore(key, member); }
  }

  async del(key: string): Promise<void> {
    const c = await this.getClient();
    if (!c) { this.memoryDel(key); return; }
    try { await c.del(key); } catch { this.memoryDel(key); }
  }

  async incr(key: string): Promise<number> {
    const c = await this.getClient();
    if (!c) return this.memoryIncr(key);
    try { return await c.incr(key); } catch { return this.memoryIncr(key); }
  }

  async decr(key: string): Promise<number> {
    const c = await this.getClient();
    if (!c) return this.memoryDecr(key);
    try { return await c.decr(key); } catch { return this.memoryDecr(key); }
  }

  // 内存降级实现
  private memory = new Map<string, { value: string; expire?: number }>();
  private memoryZSets = new Map<string, Map<string, number>>();

  private memoryGet(key: string): string | null {
    const v = this.memory.get(key);
    if (!v) return null;
    if (v.expire && Date.now() > v.expire) { this.memory.delete(key); return null; }
    return v.value;
  }
  private memorySet(key: string, value: string, ttl?: number) {
    this.memory.set(key, { value, expire: ttl ? Date.now() + ttl * 1000 : undefined });
  }
  private memoryDel(key: string) { this.memory.delete(key); }
  private memoryIncr(key: string) {
    const v = this.memoryGet(key);
    const n = (v ? parseInt(v, 10) : 0) + 1;
    this.memorySet(key, String(n));
    return n;
  }
  private memoryDecr(key: string) {
    const v = this.memoryGet(key);
    const n = (v ? parseInt(v, 10) : 0) - 1;
    this.memorySet(key, String(n));
    return n;
  }
  private memoryZAdd(key: string, score: number, member: string) {
    if (!this.memoryZSets.has(key)) this.memoryZSets.set(key, new Map());
    this.memoryZSets.get(key)!.set(member, score);
  }
  private memoryZRevRange(key: string, start: number, stop: number, withScores: boolean) {
    const zset = this.memoryZSets.get(key);
    if (!zset) return [];
    const arr = Array.from(zset.entries()).sort((a, b) => b[1] - a[1]);
    const end = stop < 0 ? arr.length : stop + 1;
    const slice = arr.slice(start, end);
    return withScores ? slice.map(([member, score]) => ({ member, score })) : slice.map(([m]) => m);
  }
  private memoryZScore(key: string, member: string): number | null {
    const zset = this.memoryZSets.get(key);
    if (!zset) return null;
    return zset.get(member) ?? null;
  }
}

export const redis = new RedisManager();
export default redis;
