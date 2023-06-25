import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private redisClient;
    constructor() {
    }

    async onModuleInit() {
        this.redisClient = createClient({
            url: 'redis://127.0.0.1:6379',
            socket: { connectTimeout: 10000 },
            name: 'complaint-sys',
        });
        await this.redisClient.connect();
    }

    async saveRecord(key: any, value: {}): Promise<string> {
        let res = await this.redisClient.set(key, JSON.stringify(value));
        return res;
    }

    async updateRecord(key: string, additionalData: any): Promise<void> {
        const existingData = await this.redisClient.get(key);
        if (existingData) {
            const parsedData = JSON.parse(existingData);
            const updatedData = { ...parsedData, ...additionalData };
            this.saveRecord(key, updatedData);
        }
    }

    async getRecordById(key: string): Promise<any> {
        const record = await this.redisClient.get(key);

        return JSON.parse(record);
    }

    public async getRecords(): Promise<any> {
        let keys = await this.redisClient.keys('*');
        if (!keys) return;

        const values = await this.redisClient.mGet(keys);

        const data: Record<string, string> = {};

        keys.forEach((key, index) => {
            data[key] = JSON.parse(values[index]);
        });

        return data;
    }

}

