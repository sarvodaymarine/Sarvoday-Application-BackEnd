import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    JWT_SECREAT: str(),
    AWS_S3_BUCKET_NAME: str(),
    AWS_BUCKET_REGION: str(),
    AWS_ACCESS_KEY: str(),
    AWS_SECRET_ACCESS_KEY: str(),
    AWS_ENDPOINT_URL: str(),
    PORT: port({ default: 3000 }),
  });
}

export default validateEnv;
