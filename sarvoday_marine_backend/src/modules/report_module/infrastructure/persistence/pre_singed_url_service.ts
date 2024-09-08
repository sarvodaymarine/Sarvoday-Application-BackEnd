import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
  endpoint: process.env.BACKBLAZE_BUCKET_ENDPOINT,
  accessKeyId: process.env.BACKBLAZE_keyID,
  secretAccessKey: process.env.BACKBLAZE_APPLICATIONKEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

export type PresignedUrl = {
  url: string;
  path: string;
};

function generateDynamicPath(
  orderId: string,
  service: string,
  containerNo: string,
  fileName: string,
  date: Date,
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}/${orderId}/${service}/${containerNo}/${fileName}`;
}

// Function to generate pre-signed URLs for multiple images
export async function generatePresignedUrls(
  bucketName: string,
  orderId: string,
  service: string,
  containerNo: string,
  fileNames: string[],
  orderDate: Date,
): Promise<PresignedUrl[]> {
  const urls: PresignedUrl[] = [];

  for (const fileName of fileNames) {
    const path = generateDynamicPath(orderId, service, containerNo, fileName, orderDate);

    const params = {
      Bucket: process.env.BACKBLAZE_BUCKET_NAME,
      Key: path,
      Expires: 600,
      ACL: 'private',
    };

    try {
      // Generate pre-signed URL for PUT operation
      const url = await s3.getSignedUrlPromise('putObject', params);
      urls.push({ url, path });
    } catch (error) {
      console.error(`Error generating URL for ${fileName}:`, error);
    }
  }

  return urls;
}
