# Getting Started with Complaint System - NodeJs App, using NestJs.

A complaint system to manage all complaints
using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Description

The app expose get Complaint, get Complaint By Id and Create Complaints end points.

For inserted complaint, system save base data to redis, produce a message to queue of sqs.
There is consumer of sqs that listen to the same queue and handle each message that comes in, by request more data from external apis and update redis reltaed record with the data responses. 

### Pre Requirements
 
Install nodeJs 18,
go to https://nodejs.org/en 

Install localstack for local running of sqs & redis,
go to localstack: https://docs.localstack.cloud/getting-started/installation/#docker-compose 

 to rase the localstack up press on your terminal of the IDE in the complaint-system directory:(e.g. Visual code)
 
```bash
$ docker-compose up -d
```

now you have sqs & redis on your local machine. (they are declared in the docker-compose yml file)

install java 11 from here: https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
to be able run the craft-mock supplied by intuit:


```bash
java -jar craft-mock.jar
```

## Installation

```bash
$ npm install
```

## Running the app

# development
```bash
$ npm run start
```
app will be available at: http://localhost:5000/ 
end point for example: http://localhost:5000/Complaint/

## Test
# unit tests
```bash
$ npm run test
```
# e2e tests
```bash
$ npm run test:e2e
```


### Deicisions
For the queue which is needed to handle extract and save of external data, need high availability, fault toleranceand, scale option, so tought about kafka, it was complicated to use so deprecated and used sqs via localstack.
For db to be scale, flexible schema for additional external api in the future and very quick as posibble, redis was very good choice, (mongo was also option as it is more persistent, but with the fact of using localstack) redis was the best practice choice.

External api's:
Need to process data that returned from external resources, map each resonse to the targeted data object that will be kept in redis, remove duplication data.
I did part of it due to limited time. Improve and make more generic code to support different scaled resources. 

What need to do that I could not due to limited time:
Add unit tests for all functions, improve e2e/integration test for higher coverage and robusted code.
Clean data and queue before starting
Use dto, models and explicity types for all to cleaner code
Sperate sqs service to 2 differnet services: consumer and producer.
Validate data during all the process.
Add Logs to be able monitor the app.