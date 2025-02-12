import { html } from "hono/html";
import { Child } from "hono/jsx";

export const Layout = (props: { children?: Child }) => html`<!DOCTYPE html>
  <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${props.children}
    </body>
  </html>`;
