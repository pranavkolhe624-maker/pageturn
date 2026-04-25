# PageTurn Backend API

Complete REST API backend for a book selling and buying platform built with Node.js, Express.js, and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the required environment variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pageturn
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication (/api/auth)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

### Books (/api/books)
- `GET /` - Get all books with filtering and pagination
- `GET /:id` - Get a single book
- `POST /` - Create a new book listing (auth required, seller/admin)
- `PUT /:id` - Update a book (auth required, owner only)
- `DELETE /:id` - Delete a book (auth required, owner/admin)
- `GET /seller/my-books` - Get logged-in seller's books
- `PATCH /:id/approve` - Approve book listing (admin only)
- `GET /admin/pending` - Get pending books (admin only)

### Orders (/api/orders)
- `POST /` - Place a new order (auth required)
- `GET /my-orders` - Get logged-in user's orders
- `GET /:id` - Get order by ID (auth required)
- `PATCH /:id/status` - Update order status (auth required, seller/admin)
- `DELETE /:id` - Cancel an order (auth required, buyer)
- `GET /` - Get all orders (admin only)

### Reviews (/api/reviews)
- `POST /book/:bookId` - Add review to a book (auth required)
- `GET /book/:bookId` - Get all reviews for a book
- `DELETE /:id` - Delete a review (auth required, owner/admin)
- `GET /user/my-reviews` - Get logged-in user's reviews

### Users (/api/users)
- `GET /profile` - Get logged-in user profile (auth required)
- `PUT /profile` - Update user profile (auth required)
- `POST /wishlist/:bookId` - Add book to wishlist (auth required)
- `DELETE /wishlist/:bookId` - Remove book from wishlist (auth required)
- `GET /wishlist` - Get user's wishlist (auth required)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID (admin only)

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

All API responses follow a standard format:
```json
{
  "success": true/false,
  "message": "Description of response",
  "data": {},
  "error": null
}
```

## Database Models

### User
- name, email, password (hashed), avatar, phone
- address (street, city, state, pincode)
- role (buyer, seller, admin)
- wishlist
- resetPasswordToken, resetPasswordExpire
- createdAt

### Book
- title, author, isbn
- genre, condition, description
- price, discountPrice, stock
- coverImage
- seller (reference to User)
- rating (average, count)
- isApproved
- createdAt

### Order
- buyer (reference to User)
- items (array of book references with quantity and price)
- totalAmount
- shippingAddress
- paymentMethod, paymentStatus
- orderStatus
- trackingId
- cancellationReason
- createdAt, updatedAt

### Review
- book (reference to Book)
- user (reference to User)
- rating (1-5)
- comment
- createdAt

## Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # Cloudinary setup
├── models/
│   ├── User.js
│   ├── Book.js
│   ├── Order.js
│   └── Review.js
├── routes/
│   ├── auth.routes.js
│   ├── book.routes.js
│   ├── order.routes.js
│   ├── review.routes.js
│   └── user.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── book.controller.js
│   ├── order.controller.js
│   ├── review.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js    # JWT verification & authorization
│   ├── upload.middleware.js  # Multer & Cloudinary config
│   └── error.middleware.js   # Global error handler
├── utils/
│   ├── generateToken.js      # JWT generation & verification
│   └── apiResponse.js        # Standard response format
├── server.js                 # Main server file
├── .env                      # Environment variables
└── package.json
```

## Next Steps

1. Configure MongoDB URI in .env
2. Set up Cloudinary account and add credentials to .env
3. Configure email service for password reset (optional)
4. Run the server with `npm run dev`
5. Test endpoints using Postman or similar tools
6. Connect frontend to the API at `/api` endpoints

## Notes

- The server uses CORS enabled for frontend at localhost:3000
- All passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days (configurable in .env)
- Book cover images are uploaded to Cloudinary
- All API responses follow a consistent JSON format
