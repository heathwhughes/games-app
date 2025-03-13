import pkg from 'pg'; // Import the entire pg package
const { Pool } = pkg; // Destructure Pool from it
import dotenv from 'dotenv';
import { getSecret } from './infrastructure/secrets.js';

dotenv.config();

// Explicitly define Pool type separately
type PoolType = pkg.Pool;

let pool: PoolType | null = null;

const initializeDatabase = async (): Promise<PoolType> => {
    try {
        const secret = await getSecret();

        if (!secret) {
            throw new Error("The secret cannot be undefined");
        }

        const secretValues = JSON.parse(secret);

        pool = new Pool({
            user: secretValues.username,
            host: secretValues.host,
            database: secretValues.dbInstanceIdentifier,
            password: secretValues.password,
            port: 5432,
        });

        // Test the connection
        await pool.query('SELECT NOW()');
        console.log('Database connected successfully.');

        return pool;
    } catch (error) {
        console.error("Error initializing the database:", error);
        process.exit(1);
    }
};

export { initializeDatabase, pool };
