import { Hono } from "hono";
import { Bindings } from "./handler/bindings";
import { montos } from "./handler/montos";
import { monto } from "./handler/monto";
import { indexHandler } from "./handler";
import { insertManyMontos } from "./handler/api/insertManyMontos";
import { generateHomyo } from "./handler/generateHomyo";
import { InvalidParameterError } from "./usecase/error/invalidPrameter";
import { HTTPException } from "hono/http-exception";
import { jsxRenderer } from "hono/jsx-renderer";
import { newMonto } from "./handler/newMonto";
import { newMontoAction } from "./handler/newMontoAction";
import { csrf } from "hono/csrf";
import Error500 from "./pages/500";
import Error404 from "./pages/404";
import { editMonto } from "./handler/editMonto";
import { editMontoAction } from "./handler/editMontoAction";

const montoApp = new Hono<{ Bindings: Bindings }>()
  .get("/", ...montos)
  .post("/new", ...newMontoAction)
  .get("/new", ...newMonto)
  .post("/:id/edit", ...editMontoAction)
  .get("/:id/edit", ...editMonto)
  .get("/:id", ...monto);

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

    if (err instanceof HTTPException && err.status === 404) {
      return c.render(<Error404 />);
    }

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
