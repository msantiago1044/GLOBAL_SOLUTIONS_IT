import { Client, QueryResult, QueryResultRow } from 'pg';
import { validateServerEnv } from '../config/env';

/**
 * Obtiene una instancia conectada del cliente de PostgreSQL
 */
export async function getDbClient(): Promise<Client> {
  const env = validateServerEnv();
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurada en las variables de entorno del servidor');
  }

  const client = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  return client;
}

/**
 * Ejecuta una consulta o comando SQL directamente contra la base de datos de Supabase
 */
export async function executeSql<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  const client = await getDbClient();
  try {
    return await client.query<T>(sql, params);
  } finally {
    await client.end();
  }
}
