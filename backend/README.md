# ERIBOOKSTORE Backend

## Overview
The backend of ERIBOOKSTORE is built using Node.js and Express.js, providing APIs for managing books, users, orders, payments, and more. It integrates with MongoDB Atlas for database storage, Cloudinary for image uploads, and Nodemailer for email notifications.

## Tech Stack
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB Atlas** – Cloud database
- **Cloudinary** – Image storage
- **Nodemailer** – Email service

## Folder Structure
```
backend/
│-- config/              # Configuration files (Cloudinary, Database)
│-- controllers/         # Business logic for different entities
│-- middleware/          # Authentication & file upload middleware
│-- models/              # Mongoose models for database
│-- routes/              # API route definitions
│-- utils/               # Utility functions (Email Service, Newsletter Scheduler)
│-- .env                 # Environment variables (ignored in Git)
│-- package.json         # Dependencies and scripts
│-- server.js            # Main entry point of the application
```

## Installation & Setup
### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- Create a Cloudinary account

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/ERIBOOKSTORE.git
   cd ERIBOOKSTORE/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `backend/` folder.
   - Add the following variables:
     ```env
     MONGO_URI=your_mongodb_uri
     CLOUDINARY_CLOUD_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your_email
     EMAIL_PASS=your_email_password
     ```
4. Start the backend server:
   ```sh
   npm start
   ```

## API Routes
### Authentication
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user

### Books
- `GET /api/books` – Get all books
- `POST /api/books` – Add a new book (Admin only)

### Cart
- `GET /api/cart` – Get user’s cart
- `POST /api/cart` – Add book to cart

### Orders
- `GET /api/orders` – Get user orders
- `POST /api/orders` – Place an order

### More routes available in the `routes/` folder.

## Deployment on Render
1. Create a new web service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set up environment variables as defined in `.env`.
4. Deploy and obtain the API URL.

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and commit with a descriptive message.
4. Push to your branch and create a pull request.

## License
This project is open-source and available under the [MIT License](LICENSE).
