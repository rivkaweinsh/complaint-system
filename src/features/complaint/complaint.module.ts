import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { RedisService } from '@services/redis/redis.service';
import { SqsService } from '@services/sqs/sqs.service';
import { ExternalApiService } from '@services/external-api/external.api.service';

@Module({
    imports: [
    ],
    controllers: [ComplaintController],
    providers: [
        ComplaintService,
        RedisService,
        SqsService,
        ExternalApiService
    ],
})
export class ComplaintModule { }
