import { html } from "hono/html";

export const Layout = (props: { children?: any }) => html`<!DOCTYPE html>
  <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${props.children}
    </body>
  </html>`;
