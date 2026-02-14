import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { BlogPostModel } from './src/models/BlogPost';

const migrateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const posts = await BlogPostModel.find();
    console.log(`Found ${posts.length} posts to update`);

    for (const post of posts) {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      post.slug = slug;
      await post.save();
      console.log(`Updated: ${post.title} -> ${slug}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateSlugs();
