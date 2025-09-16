import knex from "knex";
import dotenv from "dotenv";
import { join } from "path";

const environment = process.env.NODE_ENV || "development";

if (environment === "test") {
	dotenv.config({ path: join(__dirname, "../../.env.test") });
} else {
	dotenv.config();
}

const config: { [key: string]: knex.Knex.Config } = {
	development: {
		client: "postgresql",
		connection: {
			host: process.env.DB_HOST || "localhost",
			port: Number(process.env.DB_PORT) || 5432,
			database: process.env.DB_NAME || "golden_raspberry",
			user: process.env.DB_USER || "golden_user",
			password: process.env.DB_PASSWORD || "golden_password",
			ssl:
				process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
		},
		pool: {
			min: 2,
			max: 10,
		},
	},
	test: {
		client: "postgresql",
		connection: {
			host: process.env.DB_HOST || "localhost",
			port: Number(process.env.DB_PORT) || 5432,
			database: process.env.DB_NAME || "golden_raspberry_test",
			user: process.env.DB_USER || "golden_user",
			password: process.env.DB_PASSWORD || "golden_password",
			ssl:
				process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
		},
		pool: {
			min: 2,
			max: 10,
		},
	},
	production: {
		client: "postgresql",
		connection: process.env.DATABASE_URL || {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT) || 5432,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			ssl:
				process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
		},
		pool: {
			min: 2,
			max: 10,
		},
	},
};

const db = knex(config[environment]);

export default db;
