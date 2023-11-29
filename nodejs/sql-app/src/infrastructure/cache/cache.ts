import { createClient } from "redis";
import { ICacheService } from "../../domain/interfaces/cacheRepository";
import { redis } from "../config/config";

export class RedisCacheService implements ICacheService{
    private client;

    constructor(){
        this.client = createClient({url: redis.url}); //crear cliente
        this.client.connect(); //conectar al cliente cada que se instancie el cliente
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);        
    }

    async set(key: string, value: string): Promise<void>{
        await this.client.set(key,value);
        
    }
}