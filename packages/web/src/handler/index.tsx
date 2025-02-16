import Index from "../pages";
import { factory } from "./factory";

export const indexHandler = factory.createHandlers(async (c) => {
  return c.render(<Index />);
});
