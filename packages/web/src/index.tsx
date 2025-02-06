import { Hono } from "hono";
import Montos from "./pages/montos";

const app = new Hono();

app.get("/montos", (c) => {
  return c.html(<Montos />);
});

app.fire();
