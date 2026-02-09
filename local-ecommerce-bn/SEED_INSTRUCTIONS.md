# Database Seeding Instructions

This guide will help you set up and seed your MongoDB database with initial data.

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database running. You can use:
   - Local MongoDB installation
   - MongoDB Atlas (cloud)
   - Docker MongoDB container

2. **Environment Variables**: Create a `.env` file in the `Backend/local-ecommerce-bn` directory with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/smart-local-commerce
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-local-commerce?retryWrites=true&w=majority

# Server Port
PORT=3000

# JWT Secret
JWT_SECRET=your-secret-key-here-change-in-production

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Running the Seed Script

1. **Navigate to the backend directory**:
   ```bash
   cd Backend/local-ecommerce-bn
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Run the seed script**:
   ```bash
   npm run seed
   ```

## What the Seed Script Does

The seed script will:

1. ✅ Connect to your MongoDB database
2. ✅ Clear existing data (categories, users, shops, products)
3. ✅ Create 7 categories (Clothing, Electronics, Home & Kitchen, etc.)
4. ✅ Create 3 users:
   - Admin user (admin@niceshop.com / admin123)
   - Business owner 1 (simba@shop.com / business123)
   - Business owner 2 (aaky@shop.com / business123)
5. ✅ Create 4 shops:
   - Simba Supermarket
   - Aaky Fashion
   - SBO Electronics
   - Levi Store
6. ✅ Create 15 products with images from various categories

## Default Login Credentials

After seeding, you can use these credentials to login:

- **Admin**: 
  - Email: `admin@niceshop.com`
  - Password: `admin123`

- **Business Owner 1**: 
  - Email: `simba@shop.com`
  - Password: `business123`

- **Business Owner 2**: 
  - Email: `aaky@shop.com`
  - Password: `business123`

## Troubleshooting

### Connection Error
If you get a connection error:
- Check that MongoDB is running
- Verify your `MONGODB_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
If port 3000 is already in use, change the `PORT` in your `.env` file.

### Module Not Found
Make sure all dependencies are installed:
```bash
npm install
```

## Notes

- The seed script will **delete all existing data** before seeding. Make sure you have a backup if needed.
- Product images are stored as URLs (from Unsplash/Pexels). In production, you may want to upload images to Cloudinary or another service.
- The script uses the same data structure as your frontend mock data for consistency.
