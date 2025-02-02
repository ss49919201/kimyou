import { serve, type HttpBindings } from "@hono/node-server";
import { Hono } from "hono";

type Bindings = HttpBindings;

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  });
});

serve(app);
