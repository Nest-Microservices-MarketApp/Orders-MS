import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
}

const envSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required().default(3001),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
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
};
