import dotenv from "dotenv";
import { serve } from "@hono/node-server";
import app from "./app";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

serve({
	fetch: app.fetch,
	port: port,
	hostname: "0.0.0.0",
});
