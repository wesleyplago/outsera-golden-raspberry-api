import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("movies", (table) => {
		table.increments("id").primary();
		table.integer("year").notNullable();
		table.string("title").notNullable();
		table.text("studios").notNullable();
		table.text("producers").notNullable();
		table.boolean("winner").defaultTo(false);
		table.timestamps(true, true);

		table.index("year");
		table.index("winner");
		table.index(["year", "winner"]);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("movies");
}
