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
import { csrf } from "hono/csrf";
import Error500 from "./pages/500";

const montoApp = new Hono<{ Bindings: Bindings }>()
  .get("/", ...findManyMontos)
  .post("/", ...insertMonto)
  .get("/new", ...newMonto)
  .get("/:id", ...findOneMonto);

const homyoApp = new Hono<{ Bindings: Bindings }>().get(
  "/generate",
  ...generateHomyo
);

const apiApp = new Hono<{ Bindings: Bindings }>()
  .onError((err, c) => {
    console.error(err);

    if (
      err instanceof InvalidParameterError ||
      (err instanceof HTTPException && err.status === 400)
    ) {
      return c.json(
        {
          msg: "Bad request",
          detail: err.message,
        },
        400
      );
    }

    return c.json(
      {
        msg: "Internal server error",
      },
      500
    );
  })
  .post("/montos/_batch", ...insertManyMontos);

const app = new Hono<{ Bindings: Bindings }>()
  .onError((err, c) => {
    console.error(err);

    // Error generated after passing html input validation are not expected.
    return c.render(<Error500 />);
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
  .use(csrf())
  .get("/", ...indexHandler)
  .route("/montos", montoApp)
  .route("/homyos", homyoApp)
  .route("/api", apiApp);

export default app;
