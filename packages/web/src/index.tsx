import { Hono } from "hono";
import { Bindings } from "./handler/bindings";
import { findManyMontos } from "./handler/findManyMontos";
import { findOneMonto } from "./handler/findOneMonto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/insertManyMontos";
import { generateHomyo } from "./handler/generateHomyo";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", ...indexHandler);

app.get("/montos", ...findManyMontos);

app.get("/montos/:id", ...findOneMonto);

app.post("/montos/_batch", ...insertManyMontos);

app.get("/homyos/generate", ...generateHomyo);

export default app;
