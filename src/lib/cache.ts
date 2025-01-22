import { Redis } from 'ioredis';  
import { Todo } from './types';

const CACHE_TTL = 3600; 

export class TodoCache {
  private redis: Redis;
  private readonly prefix = 'todo:';

  constructor() {
    // Use environment variables for Redis configuration
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined;

    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
    });
  }

  private getKey(id: string): string {
    return `${this.prefix}${id}`;
  }

  async get(id: string): Promise<Todo | null> {
    const data = await this.redis.get(this.getKey(id));
    return data ? JSON.parse(data) : null; 
  }

  async set(todo: Todo): Promise<void> {
    await this.redis.set(this.getKey(todo.id), JSON.stringify(todo), 'EX', CACHE_TTL);
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
    
    return todos.filter(Boolean).map(todo => JSON.parse(todo as string)) as Todo[];
  }
}
