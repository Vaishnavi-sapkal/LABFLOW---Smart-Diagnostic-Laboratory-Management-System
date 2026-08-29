# LabFlow Sample Service

Sample Tracking microservice for the LabFlow Smart Diagnostic Laboratory Management System.

## Overview
The Sample Service manages laboratory sample collection, tracking, status updates, and rejection throughout the diagnostic workflow.

## Features
- Sample creation with booking validation
- Automatic sample ID generation (SMP-YYMM-###)
- Sample status tracking
- Kanban-ready grouped sample listing
- Sample advance and rejection workflow
- Patient and test information snapshot
- MongoDB Atlas integration
- Request validation using DTOs
- Swagger API documentation
- Health check endpoint

## Sample Workflow
Collected -> In Transit -> Processing -> Completed
     |
  Rejected

## API Endpoints
POST   /samples              Create a sample
GET    /samples              Get samples grouped by status
GET    /samples/:id          Get sample by ID
PATCH  /samples/:id/advance  Advance sample to next stage
PATCH  /samples/:id/reject   Reject a sample
DELETE /samples/:id          Delete a sample
GET    /health               Service health check
GET    /api                  Swagger API documentation

## Tech Stack
- NestJS
- TypeScript
- MongoDB Atlas
- Mongoose
- Swagger / OpenAPI
- Class Validator

## Environment Variables
Create a .env file:

PORT=3000
MONGODB_URI=<your-mongodb-atlas-uri>
BOOKING_SERVICE_URL=http://localhost:3004/bookings

## Run Locally
npm install
npm run start:dev

Service:
http://localhost:3000

Swagger:
http://localhost:3000/api
