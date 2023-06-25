import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExternalApiService } from '@services/external-api/external.api.service';
import { RedisService } from '@services/redis/redis.service';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsService implements OnModuleInit {
    private sqs: SQS;
    private queueUrl: string;


    constructor(private readonly redisService: RedisService,
        private readonly externalApiService: ExternalApiService) {
    }
    async onModuleInit() {
        this.sqs = new SQS({
            region: 'us-east-2',
            endpoint: 'http://localhost:4566',
            accessKeyId: 'test',
            secretAccessKey: 'dummy',
        });

        this.queueUrl = await this.createQueue('complaints');
        this.consumeMessages();
    }

    public async createQueue(queueName: string): Promise<string> {
        const params = {
            QueueName: queueName,
        };

        const result = await this.sqs.createQueue(params).promise();
        return result.QueueUrl;
    }

    public async sendMessage(userId: string, purchaseId: string): Promise<string> {
        const params = {
            MessageBody: JSON.stringify({ userId, purchaseId }),
            QueueUrl: this.queueUrl,
        };

        const result = await this.sqs.sendMessage(params).promise();
        return result.MessageId;
    }

    public async consumeMessages(): Promise<void> {
        const params = {
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5,
        };

        while (true) {
            const response = await this.sqs.receiveMessage(params).promise();

            if (response.Messages && response.Messages.length > 0) {
                for (const message of response.Messages) {
                    await this.handleMessage(message.Body);
                    await this.deleteMessage(message.ReceiptHandle);
                }
            }
        }
    }

    async handleMessage(bodyMessage: any) {
        const ids = JSON.parse(bodyMessage) as { userId, purchaseId };
        const additionalData = await this.externalApiService.fetchResourceDataByIds(ids);

        await this.redisService.updateRecord(ids.userId, additionalData);
    }

    private async deleteMessage(receiptHandle: string): Promise<void> {
        const params = {
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle,
        };

        await this.sqs.deleteMessage(params).promise();
    }
}