import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary with credentials from environment
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload image to Cloudinary and return the URL
   */
  async uploadImage(
    file: any,
    folder: string = 'admin-dashboard',
  ): Promise<string> {
    if (!file) {
      throw new InternalServerErrorException('No file provided');
    }

    try {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(
                new InternalServerErrorException(
                  `Cloudinary upload failed: ${error.message}`,
                ),
              );
            } else if (result) {
              resolve(result.secure_url);
            } else {
              reject(
                new InternalServerErrorException('Unknown error during upload'),
              );
            }
          },
        );

        stream.on('error', (error: any) => {
          reject(
            new InternalServerErrorException(
              `Stream error: ${error?.message || 'Unknown error'}`,
            ),
          );
        });

        stream.end(file.buffer);
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Image upload failed: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete image from Cloudinary by public ID
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Cloudinary deletion failed: ${error?.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  extractPublicId(url: string): string {
    // Extract public ID from URL like: https://res.cloudinary.com/cloud/image/upload/v123/folder/filename
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\./);
    return match ? match[1] : '';
  }
}
