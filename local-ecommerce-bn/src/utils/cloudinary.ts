import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer: Buffer, folder: string = 'products'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};
