import NewMonto from "../pages/montos/new";
import { factory } from "./factory";

export const newMonto = factory.createHandlers(async (c) => {
  return c.render(<NewMonto />);
});
