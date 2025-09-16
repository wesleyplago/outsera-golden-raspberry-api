export class Movie {
	constructor(
		public year: number,
		public title: string,
		public studios: string,
		public producers: string,
		public winner: boolean,
	) {}

	static fromCsvRow(row: Record<string, string>): Movie {
		return new Movie(
			parseInt(row.year),
			row.title,
			row.studios,
			row.producers,
			row.winner === "yes",
		);
	}

	getProducersList(): string[] {
		return this.producers
			.split(/,|\sand\s/)
			.map((producer) => producer.trim())
			.filter((producer) => producer.length > 0);
	}
}
