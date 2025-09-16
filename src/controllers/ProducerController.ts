import type { Context } from "hono";
import type { ProducerService } from "../services/ProducerService";

export class ProducerController {
	constructor(private producerService: ProducerService) {}

	async getProducerIntervals(c: Context) {
		try {
			const intervals = await this.producerService.getProducerIntervals();
			return c.json(intervals);
		} catch (error) {
			console.error("Erro ao obter intervalos de produtores:", error);
			return c.json({ error: "Erro interno do servidor" }, 500);
		}
	}
}
