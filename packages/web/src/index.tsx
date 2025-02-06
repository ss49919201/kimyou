import { Hono } from "hono";
import Montos from "./pages/montos";
import { drizzle } from "drizzle-orm/d1";
import { findManyWithPage } from "./infrastructure/db/d1/monto";

type Bindings = {
  D1: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/montos", async (c) => {
  // TODO: implement me
  const db = drizzle(c.env.D1);
  const result = await findManyWithPage(db);
  console.log("result", result);

  return c.html(<Montos />);
});

export default app;
