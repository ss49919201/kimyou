import { createFactory } from "hono/factory";
import { Bindings } from "./bindings";

export const factory = createFactory<{ Bindings: Bindings }>();
