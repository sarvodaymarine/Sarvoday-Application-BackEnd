import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
dotenv.config();

const s3ClientObject = new S3Client({
  region: process.env.AWS_BUCKET_REGION ?? '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
  endpoint: process.env.AWS_ENDPOINT_URL,
});

export class ImageUploadService {
  async getSignedAWSFileOrIMageUrl(path: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path,
      });
      const url = await getSignedUrl(s3ClientObject, command);
      return url;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).toString());
    }
  }

  async putSignedUrlforAWsImageUpload(path: string): Promise<string> {
    try {
      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path,
      });
      console.log('putCommonad', putCommand);
      const url = await getSignedUrl(s3ClientObject, putCommand, { expiresIn: 300 });
      console.log('url', url);
      return url;
    } catch (error) {
      console.log(error);
      throw new Error((error as Error).toString());
    }
  }
}
