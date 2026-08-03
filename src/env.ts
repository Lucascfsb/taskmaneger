import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const formattedErrors = _env.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  console.error(`❌ Variáveis de ambiente inválidas:\n${formattedErrors}`);
  throw new Error('Variáveis de ambiente inválidas.');
}

export const env = _env.data;