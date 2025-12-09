import { ForgetPasswordForm } from "@/components/forget-password-form";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { AuthLayout } from "@/layouts/auth-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forget-password")({
  component: RouteComponent,
});

function RouteComponent() {
  useDocumentTitle("Forgot Password");

  return (
    <AuthLayout>
      <ForgetPasswordForm />
    </AuthLayout>
  );
}
