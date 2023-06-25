import { Module } from '@nestjs/common';
import { SqsService } from './Sqs.service';
import { ExternalApiService } from '@services/external-api/external.api.service';
import { RedisService } from '@services/redis/redis.service';

@Module({
    providers: [SqsService, RedisService, ExternalApiService],
    exports: [SqsService],
})
export class SqsModule { }
