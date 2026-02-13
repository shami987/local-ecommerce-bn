import { Request, Response } from 'express';
import { BlogPostModel } from '../models/BlogPost';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter: any = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'published';

    const posts = await BlogPostModel.find(filter)
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await BlogPostModel.countDocuments(filter);

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const post = await BlogPostModel.findOne({ slug: req.params.slug })
      .populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, category, status } = req.body;
    const userId = (req as any).userId;

    if (!title || !content || !excerpt || !category) {
      return res.status(400).json({ message: 'Title, content, excerpt, and category are required' });
    }

    let featuredImage = '';
    if (req.file) {
      featuredImage = await uploadToCloudinary(req.file.buffer, 'blog');
    } else {
      return res.status(400).json({ message: 'Featured image is required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const post = await BlogPostModel.create({
      title,
      content,
      excerpt,
      featuredImage,
      category,
      slug,
      author: userId,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : undefined
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Post with this title already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, category, status } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const post = await BlogPostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (userRole !== 'admin' && post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own posts' });
    }

    let featuredImage = post.featuredImage;
    if (req.file) {
      featuredImage = await uploadToCloudinary(req.file.buffer, 'blog');
    }

    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : post.slug;

    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        excerpt,
        featuredImage,
        category,
        slug,
        status,
        publishedAt: status === 'published' && post.status === 'draft' ? new Date() : post.publishedAt
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const post = await BlogPostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (userRole !== 'admin' && post.author.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await BlogPostModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
