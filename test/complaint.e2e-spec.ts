import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const clientComplaintMock = {
  "userId": "a93adc57-4d59-4a9d-85c6-b5d48d99101d",
  "subject": "The seller never sent my item!",
  "complaint": "I made a purchase and the item hasn’t shipped. It’s been over a week. Please help!",
  "purchaseId": "14b28cf0-7a0d-11ec-90d6-0242ac120003"
};

const clientComplaintMockNotInserted = {
  "userId": "a872d86a-c7cb-48b7-b5d9-f218d6845405",
  "subject": "The seller never sent my item!!",
  "complaint": "I made a purchase and the item hasn’t shipped. It’s been over a week. Please help!",
  "purchaseId": "21d5dbe2-8369-459d-a955-a6b4f19b4d53"
};


describe('ComplaintController (e2e)', () => {
  let app: INestApplication;



  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });



  afterAll(async () => {
    await app.close();
  });

  it('should create a complaint', async () => {
    const timeout = 200;
    const start = Date.now();

    // Create a complaint
    const response = await request(app.getHttpServer())
      .post('/complaint')
      .send(clientComplaintMock)

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(timeout);
    console.log('duration of create', duration);

    expect(response.status).toBe(HttpStatus.CREATED);
  });

  it('should retrieve a complaint', async () => {
    const complaintId = clientComplaintMock.userId;
    const timeout = 2000;
    const start = Date.now();

    const getResponse = await request(app.getHttpServer())
      .get(`/complaint/${complaintId}`);

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(timeout);
    console.log('duration of get', duration);
    // Retrieve the complaint


    expect(getResponse.status).toBe(HttpStatus.OK);

    const complaint = getResponse.body;
    expect(complaint.subject).toBe(clientComplaintMock.subject);
    expect(complaint.complaint).toBe(clientComplaintMock.complaint);
    expect(complaint.purchaseId).toBe(clientComplaintMock.purchaseId);

  });

  it('error for not existing complaint', async () => {
    const complaintId = clientComplaintMockNotInserted.userId;//s createResponse.body.id;

    const getResponse = await request(app.getHttpServer())
      .get(`/complaint/${complaintId}`);

    expect(getResponse.status).toBe(HttpStatus.BAD_REQUEST);
  });
});

