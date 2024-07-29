import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  PRODUCT_MICROSERVICE_HOST: string;
  PRODUCT_MICROSERVICE_PORT: number;
}

const envSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required().default(3002),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    DATABASE_URL: joi.string().required(),
    PRODUCT_MICROSERVICE_HOST: joi.string().required().default('localhost'),
    PRODUCT_MICROSERVICE_PORT: joi.number().required().default(3001),
  })
  .unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(
    `Config validation error: ${error.message}. Please check your environment variables.`,
  );
}

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  databaseUrl: envVars.DATABASE_URL,
  productMicroserviceHost: envVars.PRODUCT_MICROSERVICE_HOST,
  productMicroservicePort: envVars.PRODUCT_MICROSERVICE_PORT,
};
