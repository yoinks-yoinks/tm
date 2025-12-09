import { SignUpForm } from "@/components/sign-up-form";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { AuthLayout } from "@/layouts/auth-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  useDocumentTitle("Sign Up");

  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
