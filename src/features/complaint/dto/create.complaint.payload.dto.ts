import {
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComplaintDTO {
    @ApiProperty({
        required: true,
        type: String,
        description: 'UUID',
        example: 'a93adc57-4d59-4a9d-85c6-b5d48d99101d',
    })
    @IsNotEmpty()
    @IsUUID()
    public userId: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'subject of compliant',
        example: 'The seller never sent my item!',
    })
    @IsNotEmpty()
    @IsString()
    public subject: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'body of complaint',
        example: 'I made a purchase and the item hasn’t shipped. It’s been over a week. Please help!',
    })
    @IsNotEmpty()
    @IsString()
    public complaint: string;

    @ApiProperty({
        required: true,
        type: String,
        description: 'purchase uuid',
        example: '14b28cf0-7a0d-11ec-90d6-0242ac120003',
    })
    @IsNotEmpty()
    @IsString()
    public purchaseId: string;
}
