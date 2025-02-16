import { Hono } from "hono";
import { Bindings } from "./handler/bindings";
import { findManyMontos } from "./handler/findManyMontos";
import { findOneMonto } from "./handler/findOneMonto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/api/insertManyMontos";
import { generateHomyo } from "./handler/generateHomyo";
import { InvalidParameterError } from "./usecase/error/invalidPrameter";
import { HTTPException } from "hono/http-exception";
import { jsxRenderer } from "hono/jsx-renderer";
import { newMonto } from "./handler/newMonto";
import { insertMonto } from "./handler/insertMonto";

const montoApp = new Hono<{ Bindings: Bindings }>()
  .get("/", ...findManyMontos)
  .post("/", ...insertMonto)
  .get("/new", ...newMonto)
  .get("/:id", ...findOneMonto);

const homyoApp = new Hono<{ Bindings: Bindings }>().get(
  "/generate",
  ...generateHomyo
);

const apiApp = new Hono<{ Bindings: Bindings }>().post(
  "/montos/_batch",
  ...insertManyMontos
);

const app = new Hono<{ Bindings: Bindings }>()
  .onError((err, c) => {
    console.error(err);

    if (err instanceof HTTPException) {
      throw err;
    }

    if (err instanceof InvalidParameterError) {
      return c.text("Bad request", 400);
    }

    return c.text("Internal server error", 500);
  })
  .use(
    jsxRenderer(({ children }) => (
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>{children}</body>
      </html>
    ))
  )
  .get("/", ...indexHandler)
  .route("/montos", montoApp)
  .route("/homyos", homyoApp)
  .route("/api", apiApp);

export default app;
