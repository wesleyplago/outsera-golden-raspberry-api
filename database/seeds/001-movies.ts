import type { Knex } from "knex";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

export async function seed(knex: Knex): Promise<void> {
	await knex("movies").del();

	const csvPath = path.join(__dirname, "../../src/data/Movielist.csv");
	interface MovieData {
		year: number;
		title: string;
		studios: string;
		producers: string;
		winner: boolean;
	}

	const movies: MovieData[] = [];

	return new Promise((resolve, reject) => {
		fs.createReadStream(csvPath)
			.pipe(csv({ separator: ";" }))
			.on("data", (row: Record<string, string>) => {
				try {
					const movie = {
						year: parseInt(row.year),
						title: row.title?.trim() || "",
						studios: row.studios?.trim() || "",
						producers: row.producers?.trim() || "",
						winner: row.winner?.toLowerCase() === "yes",
					};

					if (movie.year && movie.title) {
						movies.push(movie);
					}
				} catch {}
			})
			.on("end", async () => {
				try {
					const batchSize = 100;
					for (let i = 0; i < movies.length; i += batchSize) {
						const batch = movies.slice(i, i + batchSize);
						await knex("movies").insert(batch);
					}

					resolve();
				} catch (error) {
					reject(error);
				}
			})
			.on("error", (error: Error) => {
				reject(error);
			});
	});
}
