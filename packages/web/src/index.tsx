import { Hono } from "hono";
import { Bindings } from "./handler/bindings";
import { findManyMontos } from "./handler/findManyMontos";
import { findOneMonto } from "./handler/findOneMonto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/insertManyMontos";
import { generateHomyo } from "./handler/generateHomyo";
import { InvalidParameterError } from "./usecase/error/invalidPrameter";
import { HTTPException } from "hono/http-exception";
import { jsxRenderer } from "hono/jsx-renderer";
import { newMonto } from "./handler/newMonto";
import { insertMonto } from "./handler/insertMonto";

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

app.use(
  jsxRenderer(({ children }) => (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  ))
);

app.get("/", ...indexHandler);

app.get("/montos", ...findManyMontos);

app.get("/montos/new", ...newMonto);
app.post("/montos", ...insertMonto);

app.get("/montos/:id", ...findOneMonto);

app.post("/api/montos/_batch", ...insertManyMontos);

app.get("/homyos/generate", ...generateHomyo);

export default app;
