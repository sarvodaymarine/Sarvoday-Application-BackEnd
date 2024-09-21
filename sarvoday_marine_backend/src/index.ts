import 'dotenv-safe/config';
import 'module-alias/register';
import validateEnv from '@src/shared/validate.env';
import App from '@src/app';

validateEnv();

const app = new App(Number(process.env.PORT));
app.listen();