import postgres from 'postgres';

let sql;

if (process.env.DATABASE_URL) {
  sql = postgres(process.env.DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
  });
} else {
  const handler = {
    get() {
      return () => {
        throw new Error(
          'No database connection string was provided. Set DATABASE_URL in your .env file.'
        );
      };
    },
    apply() {
      throw new Error(
        'No database connection string was provided. Set DATABASE_URL in your .env file.'
      );
    },
  };
  sql = new Proxy(function () {}, handler);
}

export default sql;