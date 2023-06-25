# Getting Started with Complaint System - NodeJs App.

A complaint system to manage all complaints.

was build using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Description

The app expose Get Complaints, Get Complaint By Id and Create Complaint end points.

- When a complaint is submitted through the create endpoint, the system saves it's data to Redis.
- Simultaneously, a message is produced and added to the SQS queue to initiate further processing of the complaint.
- A consumer actively listens to the SQS queue, processing each incoming message.
- Upon receiving a message, the consumer interacts with external APIs to retrieve additional data associated with the complaint.
- The retrieved data is then used to update the corresponding record in Redis.

## Pre Requirements
 
- Install nodeJs 18,
go to https://nodejs.org/en 

- Install localstack for local running of sqs & redis,
go to localstack: https://docs.localstack.cloud/getting-started/installation/#docker-compose 

 to rase the localstack up press on your terminal of the IDE in the complaint-system directory:(e.g. Visual code)
 
```bash
$ docker-compose up -d
```

now you have sqs & redis on your local machine. (they are declared in the docker-compose yml file)

- Install java 11, go to https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
to be able run the craft-mock supplied by intuit:


```bash
java -jar craft-mock.jar
```

## Installation

```bash
$ npm install
```

## Running the app

### development
```bash
$ npm run start
```
app will be available at: http://localhost:5000/ 
end point for example: http://localhost:5000/Complaint/

## Test
### unit tests
```bash
$ npm run test
```
### e2e tests
```bash
$ npm run test:e2e
```


## Decisions

During the design decisions for the project, several factors were considered to ensure high availability, fault tolerance, and scalability.

### Queue
To handle the extraction and storage of external data, a queue system was needed. Initially, Kafka was considered due to its scalability and fault-tolerant features. However, considering the complexity involved, it was deprecated in favor of using SQS via localstack, which provided a more straightforward implementation while still meeting the requirements.

### Database Choice
For the database, key considerations were scalability, flexibility of schema for potential future integration with external APIs, and fast data retrieval. Redis is a great choice, providing excellent performance. Although MongoDB was also considered for its persistence capabilities, given the usage of localstack, Redis proved to be a better choice.

### External APIs
The project involves processing data retrieved from external resources, mapping each response to the relevant data object stored in Redis, and removing duplicate data. due to time constraints, further improvements are needed to make the code more generic and support carefull mappinf of data objects.

### Pending Tasks (Due to Time Constraints)

- Implement unit tests for all functions to ensure code quality and stability.
- Enhance end-to-end (E2E) and integration tests for higher coverage and more robust code.
- Perform data and queue cleanup before starting the application/run tests to ensure a clean environment.
- Utilize DTOs, models, and explicit types throughout the codebase to improve code readability and maintainability.
- Separate the SQS service into two distinct services: consumer and producer.
- Implement data validation at each step of the process to ensure data integrity and reliability.
- Add logging capabilities to enable effective monitoring of the application.
- Configure the initialization variables that will not be hardcoded.
- Allow pagination for the endpoint of receiving complaints.
- Requesting all keys using Redis is not safe, this is temporarily.
- Enhance error handling by adding more `try` and `catch` blocks to gracefully handle exceptions and ensure code stability.
