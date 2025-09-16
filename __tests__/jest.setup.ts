import { setupTestDatabase, teardownTestDatabase } from "./test-setup";

beforeAll(async () => {
	await setupTestDatabase();
});

afterAll(async () => {
	await teardownTestDatabase();

	await new Promise((resolve) => setTimeout(resolve, 100));
});
