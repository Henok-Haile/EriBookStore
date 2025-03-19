### **`README.md` - ERIBOOKSTORE Backend**  

# 📚 ERIBOOKSTORE Backend  

## 🚀 Overview  
The backend of **ERIBOOKSTORE** is built using **Node.js** and **Express.js**, providing RESTful APIs for managing books, users, orders, payments, and more. It integrates with:  

- **MongoDB Atlas** → Cloud-based database  
- **Cloudinary** → Image storage  
- **Nodemailer** → Email notifications  
- **Stripe** → Secure online payments  



## 🛠 Tech Stack  

| Technology  | Purpose |
|-------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Backend framework |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image storage |
| **Nodemailer** | Email service |
| **Stripe** | Payment processing |



## 📂 Folder Structure  


ERIBOOKSTORE/
│-- Backend/
│   │-- config/                # Configuration files  
│   │   ├── db.config.js        # Database connection  
│   │   ├── cloudinary.config.js # Cloudinary setup  
│   │  
│   │-- controllers/            # Business logic for various features  
│   │   ├── admin.controller.js  
│   │   ├── auth.controller.js  
│   │   ├── book.controller.js  
│   │   ├── cart.controller.js  
│   │   ├── newsletter.controller.js  
│   │   ├── order.controller.js  
│   │   ├── payment.controller.js  
│   │   ├── review.controller.js  
│   │   ├── testimonial.controller.js  
│   │   ├── user.controller.js  
│   │   ├── wishlist.controller.js  
│   │  
│   │-- middleware/             # Middleware for authentication & file uploads  
│   │   ├── auth.middleware.js  
│   │   ├── upload.middleware.js  
│   │  
│   │-- models/                 # Mongoose models for database  
│   │   ├── book.model.js  
│   │   ├── cart.model.js  
│   │   ├── newsletter.model.js  
│   │   ├── order.model.js  
│   │   ├── review.model.js  
│   │   ├── testimonial.model.js  
│   │   ├── user.model.js  
│   │  
│   │-- routes/                 # API route definitions  
│   │   ├── admin.routes.js  
│   │   ├── auth.routes.js  
│   │   ├── book.routes.js  
│   │   ├── cart.routes.js  
│   │   ├── newsletter.routes.js  
│   │   ├── order.routes.js  
│   │   ├── payment.routes.js  
│   │   ├── review.routes.js  
│   │   ├── testimonial.routes.js  
│   │   ├── user.routes.js  
│   │   ├── wishlist.routes.js  
│   │  
│   │-- utils/                  # Utility functions  
│   │   ├── emailService.js      # Email notifications  
│   │   ├── newsletterScheduler.js # Newsletter automation  
│   │   ├── queryHelpers.js      # Query optimizations  
│   │  
│   ├── .env                    # Environment variables (ignored in Git)  
│   ├── server.js                # Main entry point of the application  
│   ├── package.json             # Dependencies and scripts  



## ⚙️ Installation & Setup  

### 📌 Prerequisites  
- Install **[Node.js](https://nodejs.org/)**  
- Install **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**  
- Create a **Cloudinary account**  

### 📥 Steps  

#### 1️⃣ Clone the repository  

git clone https://github.com/your-username/ERIBOOKSTORE.git
cd ERIBOOKSTORE/Backend


#### 2️⃣ Install dependencies  

npm install


#### 3️⃣ Set up environment variables  
- Create a `.env` file in the **Backend/** folder  
- Add the following variables:  


MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_key


#### 4️⃣ Start the backend server  

npm start



## 📌 API Endpoints  

### 🔹 1. Authentication & User Management  
✅ **User Signup** → `POST /api/auth/signup`  
✅ **User Login** → `POST /api/auth/login`  
✅ **Email Verification** → `GET /api/auth/verify-email?token=YOUR_TOKEN`  
✅ **Forgot Password** → `POST /api/auth/forgot-password`  
✅ **Reset Password** → `POST /api/auth/reset-password`  
✅ **Get User Profile** → `GET /api/auth/profile` *(Requires JWT Token)*  
✅ **Admin: Get All Users** → `GET /api/auth/users` *(Admin only)*  
✅ **Admin: Delete User** → `DELETE /api/auth/users/:id` *(Admin only)*  



### 🔹 2. Book Management  
✅ **Get All Approved Books** → `GET /api/books`  
✅ **Search Books** → `GET /api/books?search=eritrean`  
✅ **Suggest a Book** → `POST /api/books/suggest` *(User Only)*  
✅ **Admin: Approve a Book** → `PUT /api/books/:id/approve`  
✅ **Admin: Add a New Book** → `POST /api/books`  
✅ **Admin: Update Book** → `PUT /api/books/:id`  
✅ **Admin: Delete Book** → `DELETE /api/books/:id`  



### 🔹 3. Wishlist  
✅ **Get Wishlist** → `GET /api/wishlist` *(User Only)*  
✅ **Add Book to Wishlist** → `POST /api/wishlist`  
✅ **Remove Book from Wishlist** → `DELETE /api/wishlist/:bookId`  



### 🔹 4. Shopping Cart  
✅ **Get Cart** → `GET /api/cart`  
✅ **Add to Cart** → `POST /api/cart/:bookId`  
✅ **Update Cart Item** → `PUT /api/cart/:bookId`  
✅ **Remove from Cart** → `DELETE /api/cart/:bookId`  
✅ **Clear Cart** → `DELETE /api/cart`  



### 🔹 5. Orders & Payments  
✅ **Create Order** → `POST /api/orders` *(Stripe Checkout)*  
✅ **Get Orders** → `GET /api/orders` *(User Only)*  
✅ **Admin: Get All Orders** → `GET /api/orders/all`  
✅ **Admin: Update Order Status** → `PUT /api/orders/:orderId/status`  
✅ **Admin: Delete Order** → `DELETE /api/orders/:orderId`  



## 🚀 Deployment on Render  

1️⃣ **Create a new web service on** [Render](https://render.com/)  
2️⃣ **Connect your GitHub repository**  
3️⃣ **Set up environment variables** *(as in `.env`)*  
4️⃣ **Deploy and obtain the API URL**  



## 📝 Contribution Guidelines  

1️⃣ **Fork the repository**  
2️⃣ **Create a new branch** *(feature-based)*  
3️⃣ **Commit changes with descriptive messages**  
4️⃣ **Push to your branch and submit a PR**  



## 📜 License  
This project is **open-source** and available under the **[MIT License](LICENSE)**.  
