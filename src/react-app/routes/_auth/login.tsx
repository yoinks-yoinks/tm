import { LoginForm } from "@/components/login-form";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { AuthLayout } from "@/layouts/auth-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  useDocumentTitle("Login");

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
