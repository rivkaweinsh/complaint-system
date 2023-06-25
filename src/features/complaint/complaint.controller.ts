import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ComplaintService } from './complaint.service';
import { ComplaintDTO } from './dto/create.complaint.payload.dto';

@ApiTags('Complaint')
@Controller('complaint')
export class ComplaintController {
    public constructor(
        private readonly service: ComplaintService,
    ) { }

    @Get('')
    public async searchComplaints(): Promise<{}[] | { errMessage: string }> {
        return this.service.getComplaints();
    }

    @Get(':id')
    public async searchComplaintById(@Param('id') id: string): Promise<{} | { errMessage: string }> {
        return this.service.getComplaintByID(id);
    }


    @Post('')
    public async setComplaint(@Body() complaintObj: ComplaintDTO): Promise<string | { errMessage: string }> {
        const { userId, subject, complaint, purchaseId } = complaintObj;
        return this.service.setComplaint(userId, subject, complaint, purchaseId);
    }
}