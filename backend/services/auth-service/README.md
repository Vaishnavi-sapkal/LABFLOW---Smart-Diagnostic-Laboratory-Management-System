LabFlow Authentication Service

Authentication microservice for the LabFlow - Smart Diagnostic Laboratory Management System.

Features:
- User Registration and Login
- Password Hashing using bcrypt
- JWT-based Authentication
- Role-Based Access Control (RBAC)
- Protected API Endpoints
- MongoDB Atlas Integration
- Swagger API Documentation

Tech Stack:
- NestJS
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT / Passport
- bcrypt
- Swagger

Supported Roles:
admin | doctor | receptionist | technician | patient

API Endpoints:
POST /auth/register     - Register a new user
POST /auth/login        - Login and generate JWT
GET  /auth/protected    - JWT protected endpoint
GET  /auth/admin-test   - Admin-only endpoint

Environment Variables:
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

Do not commit the .env file or database credentials to GitHub.

Run:
npm install
npm run start:dev

Service: http://localhost:3000
Swagger: http://localhost:3000/api

Authentication Flow:
Register -> bcrypt password hashing -> MongoDB Atlas
Login -> Password verification -> JWT Token
JWT Token -> JwtAuthGuard -> Protected API
JWT + Role -> RolesGuard -> Authorized API
