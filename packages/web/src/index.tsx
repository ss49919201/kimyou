import { Hono } from "hono";
import { Bindings } from "./handler/bindings";
import { findManyMontosHandler } from "./handler/findManyMontosHandler";
import { findOneMontoHandler } from "./handler/findOneMonto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/insertManyMontos";
import { generateHomyo } from "./handler/generateHomyo";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", ...indexHandler);

app.get("/montos", ...findManyMontosHandler);

app.get("/montos/:id", ...findOneMontoHandler);

app.post("/montos/_batch", ...insertManyMontos);

app.get("/homyos/generate", ...generateHomyo);

export default app;
