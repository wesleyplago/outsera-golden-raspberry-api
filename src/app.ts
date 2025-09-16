import { Hono } from "hono";
import { cors } from "hono/cors";
import { MovieRepository } from "./repositories/MovieRepository";
import { ProducerService } from "./services/ProducerService";
import { ProducerController } from "./controllers/ProducerController";

const app = new Hono();

app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	}),
);

const movieRepository = new MovieRepository();
const producerService = new ProducerService(movieRepository);
const producerController = new ProducerController(producerService);

app.get("/", (c) => {
	return c.json({
		message: "Golden Raspberry Awards API",
		version: "1.0.0",
		endpoints: {
			intervals: "/producers/intervals",
		},
	});
});

app.get("/producers/intervals", (c) =>
	producerController.getProducerIntervals(c),
);

app.use("*", async (c, next) => {
	await next();
});

export default app;
