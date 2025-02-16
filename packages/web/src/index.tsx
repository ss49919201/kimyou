import { Hono } from "hono";
import { Bindings } from "./handler/bindings";
import { findManyMontos } from "./handler/findManyMontos";
import { findOneMonto } from "./handler/findOneMonto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/insertManyMontos";
import { generateHomyo } from "./handler/generateHomyo";
import { InvalidParameterError } from "./usecase/error/invalidPrameter";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: Bindings }>();

app.onError((err, c) => {
  console.error(err);

  if (err instanceof HTTPException) {
    throw err;
  }

  if (err instanceof InvalidParameterError) {
    return c.text("Bad request", 400);
  }

  return c.text("Internal server error", 500);
});

app.get("/", ...indexHandler);

app.get("/montos", ...findManyMontos);

app.get("/montos/:id", ...findOneMonto);

app.post("/montos/_batch", ...insertManyMontos);

app.get("/homyos/generate", ...generateHomyo);

export default app;
