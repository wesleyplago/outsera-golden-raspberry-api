import type { MovieRepository } from "../repositories/MovieRepository";
import type { IntervalResponse } from "../types";

export class ProducerService {
	constructor(private movieRepository: MovieRepository) {}

	async getProducerIntervals(): Promise<IntervalResponse> {
		const winningMovies = await this.movieRepository.getWinningMovies();
		const producerWins = new Map<string, number[]>();

		winningMovies.forEach((movie) => {
			const producers = movie.getProducersList();
			producers.forEach((producer) => {
				const normalizedProducer = this.normalizeProducerName(producer);
				if (!producerWins.has(normalizedProducer)) {
					producerWins.set(normalizedProducer, []);
				}

				if (producerWins.get(normalizedProducer) !== undefined) {
					producerWins.get(normalizedProducer)?.push(movie.year);
				}
			});
		});

		const intervals = Array.from(producerWins.entries())
			.filter(([, years]) => years.length >= 2)
			.flatMap(([producer, years]) => {
				const sortedYears = years.sort((a, b) => a - b);
				return sortedYears.slice(1).map((year, index) => ({
					producer,
					interval: year - sortedYears[index],
					previousWin: sortedYears[index],
					followingWin: year,
				}));
			});

		if (intervals.length === 0) {
			return { min: [], max: [] };
		}

		const minInterval = Math.min(...intervals.map((i) => i.interval));
		const maxInterval = Math.max(...intervals.map((i) => i.interval));

		const minIntervals = intervals.filter((i) => i.interval === minInterval);
		const maxIntervals = intervals.filter((i) => i.interval === maxInterval);

		return {
			min: minIntervals,
			max: maxIntervals,
		};
	}

	private normalizeProducerName(name: string): string {
		return name
			.trim()
			.replace(/\s+/g, " ")
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}
}
