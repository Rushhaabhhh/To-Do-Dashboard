import { Redis } from '@upstash/redis';

import { Todo } from './types';

const CACHE_TTL = 3600 // 1 hour in seconds

export class TodoCache {
  private redis: Redis;
  private readonly prefix = 'todo:';

  constructor(redis: Redis) {
    this.redis = redis;
  }

  private getKey(id: string): string {
    return `${this.prefix}${id}`;
  }

  async get(id: string): Promise<Todo | null> {
    const data = await this.redis.get(this.getKey(id));
    return data as Todo | null;
  }

  async set(todo: Todo): Promise<void> {
    await this.redis.set(this.getKey(todo.id), JSON.stringify(todo), {
      ex: CACHE_TTL,
    });
  }

  async delete(id: string): Promise<void> {
    await this.redis.del(this.getKey(id));
  }

  async getAll(): Promise<Todo[]> {
    const keys = await this.redis.keys(`${this.prefix}*`);
    if (keys.length === 0) return [];
    
    const todos = await Promise.all(
      keys.map(key => this.redis.get(key))
    );
    
    return todos.filter(Boolean) as Todo[];
  }
}