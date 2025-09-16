import app from "../../src/app";
import type { IntervalResponse } from "../../src/types";

describe("API Integration Tests", () => {
	describe("GET /producers/intervals", () => {
		it("should return producer intervals", async () => {
			const res = await app.request("/producers/intervals");

			expect(res.status).toBe(200);

			const data = (await res.json()) as IntervalResponse;
			expect(data).toHaveProperty("min");
			expect(data).toHaveProperty("max");
			expect(Array.isArray(data.min)).toBe(true);
			expect(Array.isArray(data.max)).toBe(true);
		});

		it("should return the correct structure for intervals", async () => {
			const res = await app.request("/producers/intervals");
			const data = (await res.json()) as IntervalResponse;

			if (data.min.length > 0) {
				const minInterval = data.min[0];
				expect(minInterval).toHaveProperty("producer");
				expect(minInterval).toHaveProperty("interval");
				expect(minInterval).toHaveProperty("previousWin");
				expect(minInterval).toHaveProperty("followingWin");

				expect(typeof minInterval.producer).toBe("string");
				expect(typeof minInterval.interval).toBe("number");
				expect(typeof minInterval.previousWin).toBe("number");
				expect(typeof minInterval.followingWin).toBe("number");

				expect(minInterval.followingWin).toBeGreaterThan(
					minInterval.previousWin,
				);
				expect(minInterval.interval).toBe(
					minInterval.followingWin - minInterval.previousWin,
				);
			}

			if (data.max.length > 0) {
				const maxInterval = data.max[0];
				expect(maxInterval).toHaveProperty("producer");
				expect(maxInterval).toHaveProperty("interval");
				expect(maxInterval).toHaveProperty("previousWin");
				expect(maxInterval).toHaveProperty("followingWin");

				expect(typeof maxInterval.producer).toBe("string");
				expect(typeof maxInterval.interval).toBe("number");
				expect(typeof maxInterval.previousWin).toBe("number");
				expect(typeof maxInterval.followingWin).toBe("number");

				expect(maxInterval.followingWin).toBeGreaterThan(
					maxInterval.previousWin,
				);
				expect(maxInterval.interval).toBe(
					maxInterval.followingWin - maxInterval.previousWin,
				);
			}
		});

		it("should ensure minimum intervals are less than or equal to maximum intervals", async () => {
			const res = await app.request("/producers/intervals");
			const data = (await res.json()) as IntervalResponse;

			if (data.min.length > 0 && data.max.length > 0) {
				const minInterval = Math.min(...data.min.map((i) => i.interval));
				const maxInterval = Math.max(...data.max.map((i) => i.interval));

				expect(minInterval).toBeLessThanOrEqual(maxInterval);
			}
		});

		it("should return data consistent with the provided CSV file", async () => {
			const res = await app.request("/producers/intervals");
			const data = (await res.json()) as IntervalResponse;

			expect(data.min.length + data.max.length).toBeGreaterThan(0);

			[...data.min, ...data.max].forEach((interval) => {
				expect(interval.previousWin).toBeGreaterThanOrEqual(1980);
				expect(interval.followingWin).toBeGreaterThanOrEqual(1980);
				expect(interval.previousWin).toBeLessThan(2025);
				expect(interval.followingWin).toBeLessThan(2025);
			});
		});
	});

	describe("Error handling", () => {
		it("should return 404 for non-existent routes", async () => {
			const res = await app.request("/non-existent-route");
			expect(res.status).toBe(404);
		});
	});
});
