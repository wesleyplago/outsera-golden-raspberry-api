import dotenv from "dotenv";
import knex from "knex";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../.env.test") });

const config = {
	client: "postgresql",
	connection: {
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		database: process.env.DB_NAME || "golden_raspberry_test",
		user: process.env.DB_USER || "golden_user",
		password: process.env.DB_PASSWORD || "golden_password",
		ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
	},
	migrations: {
		directory: join(__dirname, "../database/migrations"),
	},
	seeds: {
		directory: join(__dirname, "../database/seeds"),
	},
};

let db: knex.Knex;

export const setupTestDatabase = async () => {
	db = knex(config);

	await db.migrate.latest();

	await db.seed.run();

	return db;
};

export const teardownTestDatabase = async () => {
	if (db) {
		await db("movies").del();

		await db.destroy();
	}
};

export const getTestDb = () => db;
