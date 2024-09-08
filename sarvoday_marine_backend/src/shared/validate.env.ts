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
    BACKBLAZE_keyID: str(),
    BACKBLAZE_BUCKET_NAME: str(),
    BACKBLAZE_APPLICATIONKEY: str(),
    BACKBLAZE_keyName: str(),
    BACKBLAZE_BUCKET_ENDPOINT: str(),
    PORT: port({ default: 3000 }),
  });
}

export default validateEnv;
