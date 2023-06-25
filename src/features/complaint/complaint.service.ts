import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { RedisService } from '@services/redis/redis.service';
import { SqsService } from '@services/sqs/sqs.service';

@Injectable()
export class ComplaintService {
    constructor(
        private readonly sqsService: SqsService,
        private readonly redisService: RedisService) { }

    async getComplaints(): Promise<{}[]> {
        try {
            const complaints = await this.redisService.getRecords();

            if (complaints) {
                return complaints;
            } else {
                throw new HttpException(
                    `No complaints found`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (err) {
            this.throwError('getComplaints', err);
        }
    }

    public async getComplaintByID(id: string): Promise<{}> {
        try {
            const complaint = await this.redisService.getRecordById(id);

            if (complaint) {
                return complaint;
            } else {
                throw new HttpException(
                    `No complaint found for ${id}`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (err) {
            this.throwError('getComplaintByID', err);
        }
    }

    async setComplaint(Id: string, subject: string, complaint: string, purchaseId: string): Promise<string> {
        try {
            const res = await this.redisService.saveRecord(Id, { subject, complaint, purchaseId });
            if (res == 'OK') {
                this.sqsService.sendMessage(Id, purchaseId);
                return Id;
            } else {
                throw new HttpException(
                    `No complaint was added for ${Id}`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (err) {
            this.throwError('setComplaint', err);
        }
    }

    throwError(errorSource: string, error: any) {
        if (error.status === 500) {
            throw new HttpException(
                'Internal Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        } else {
            throw error;
        }
    }
}


