import db from "../../database/connection";
import { Movie } from "../models/Movie";

export class MovieRepository {
	async getAllMovies(): Promise<Movie[]> {
		const rows = await db("movies").select("*");
		return rows.map((row) => this.mapRowToMovie(row));
	}

	async getWinningMovies(): Promise<Movie[]> {
		const rows = await db("movies").where("winner", true);
		return rows.map((row) => this.mapRowToMovie(row));
	}

	async getMoviesByYear(year: number): Promise<Movie[]> {
		const rows = await db("movies").where("year", year);
		return rows.map((row) => this.mapRowToMovie(row));
	}

	async getWinningMoviesByProducer(producerName: string): Promise<Movie[]> {
		const rows = await db("movies")
			.where("winner", true)
			.whereRaw("LOWER(producers) LIKE ?", [`%${producerName.toLowerCase()}%`]);
		return rows.map((row) => this.mapRowToMovie(row));
	}

	private mapRowToMovie(row: {
		id: number;
		year: number;
		title: string;
		studios: string;
		producers: string;
		winner: boolean;
	}): Movie {
		return new Movie(
			row.year,
			row.title,
			row.studios,
			row.producers,
			row.winner,
		);
	}
}
