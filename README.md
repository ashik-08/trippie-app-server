# Trippie - Server Side

Welcome to the server-side of Trippie, a comprehensive travel management application that allows users to book hotels, join tours, view guide profiles and make appointments with tour guides. This README provides an overview of the project, setup instructions and details about the server-side functionalities.

## Table of Contents

- [Trippie - Server Side](#trippie---server-side)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Setup Instructions](#setup-instructions)
  - [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [Auth Routes](#auth-routes)
    - [Hotel Routes](#hotel-routes)
    - [Room Routes](#room-routes)
    - [Tour Routes](#tour-routes)
    - [Guide Routes](#guide-routes)
    - [Appointment Routes](#appointment-routes)
    - [Service Routes](#service-routes)
    - [Agency Routes](#agency-routes)
  - [Project Structure](#project-structure)
  - [License](#license)
    - [Summary](#summary)

## Project Description

Trippie is a travel management application designed to simplify the process of booking hotels, joining tours, viewing guide profiles and making appointments with tour guides. The server-side application handles all the backend functionalities including user authentication, data management and integration with external services.

## Features

- **User Authentication**: Secure login and registration using Firebase Auth.
- **Hotel Management**: Manage hotels, rooms and bookings.
- **Tour Management**: Manage tours and tour bookings.
- **Guide Management**: Manage tour guides and appointments.
- **Email Notifications**: Send booking and appointment confirmation emails using SendGrid.
- **Payment Processing**: Integrate with Stripe for payment processing.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **Email Service**: SendGrid
- **Payment Processing**: Stripe

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ashik-08/trippie-app-server.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add your environment variables:

   ```plaintext
   DB_NAME=<your_mongodb_db_name>
   DB_URI=<your_mongodb_uri>
   ACCESS_TOKEN_SECRET=<64bit-token-secret>
   REFRESH_TOKEN_SECRET=<64bit-token-secret>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   SENDGRID_API_KEY=<your_sendgrid_api_key>
   SENDGRID_SENDER_EMAIL=<your_sendgrid_sender_email>
   ```

4. **Start the server**:

   ```bash
   npm start
   ```

5. **The server will be running** on `http://localhost:<your_port>`.

## API Endpoints

### User Routes

- **POST /api/users**: Create a new user
- **GET /api/users/role**: Get user role by email

### Auth Routes

- **POST /api/auth/login**: User login
- **POST /api/auth/logout**: User logout
- **POST /api/auth/refresh-token**: Refresh authentication token

### Hotel Routes

- **GET /api/hotels**: Fetch hotels based on search criteria
- **GET /api/hotels/details/:hotelId**: Fetch hotel details and available rooms
- **POST /api/hotels**: Add a new hotel
- **PUT /api/hotels/:id**: Update hotel details

### Room Routes

- **GET /api/rooms/:id**: Fetch room details by room id
- **POST /api/rooms**: Add a new room
- **PUT /api/rooms/:id**: Update room details
- **DELETE /api/rooms/:id**: Delete a room

### Tour Routes

- **GET /api/tours**: Fetch all tours
- **POST /api/tours**: Add a new tour
- **PUT /api/tours/:id**: Update a tour
- **DELETE /api/tours/:id**: Delete a tour

### Guide Routes

- **GET /api/tour-guides**: Fetch all tour guides
- **POST /api/tour-guides**: Add a new tour guide
- **PUT /api/tour-guides/:id**: Update tour guide details

### Appointment Routes

- **POST /api/appointments**: Create a new appointment
- **PUT /api/appointments/:appointmentId**: Update appointment status
- **DELETE /api/appointments/:appointmentId**: Delete an appointment

### Service Routes

- **POST /api/services**: Add a new service
- **GET /api/services/:id**: Get service by id
- **PUT /api/services/:id**: Update service by id
- **DELETE /api/services/:id**: Delete service by id

### Agency Routes

- **GET /api/tour-agencies/:email**: Fetch tour agency details by email
- **POST /api/tour-agencies**: Add a new tour agency
- **PUT /api/tour-agencies/:id**: Update tour agency details

## Project Structure

```plaintext
trippie-app-server/
├── src/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schedulers/
│   ├── services/
├── .env
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
├── README.md
```

## License

This project is licensed under a **Proprietary License**. No part of this project may be used, copied, modified or distributed without explicit permission from the project owner.

---

For any questions or support, please contact Md. Ashikur Rahman Ashik.

### Summary

This detailed README file provides an in-depth overview of the Trippie server-side project including project description, features, technologies used, setup instructions, API endpoints, project structure and license information.
