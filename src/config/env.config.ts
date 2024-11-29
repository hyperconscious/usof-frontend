import * as Joi from 'joi';

const envSchema = Joi.object({
    BACKEND_URL: Joi.string().default('http://localhost:3000'),
})
    .unknown()
    .required();

const { error, value: envVars } = envSchema.validate(import.meta.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    BACKEND_URL: envVars.BACKEND_URL,
};
export default config;
