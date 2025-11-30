import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Vite + React + Hono + Cloudflare</h1>
      <Link to="/login">Click Me</Link>
    </>
  );
}
