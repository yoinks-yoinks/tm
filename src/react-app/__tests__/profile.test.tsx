/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { ProfileForm } from "../components/profile-form";
import { ChangePasswordForm } from "../components/change-password-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a wrapper with QueryClient for testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe("ProfileForm Component", () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
  };

  test("renders profile form with user data", () => {
    const { getByLabelText, getByText } = render(<ProfileForm user={mockUser} />, { wrapper: createWrapper() });
    
    expect(getByLabelText(/name/i)).toHaveValue(mockUser.name);
    expect(getByText(mockUser.email)).toBeInTheDocument();
  });

  test("renders email as read-only display", () => {
    const { getByText } = render(<ProfileForm user={mockUser} />, { wrapper: createWrapper() });
    
    // Email should be displayed as text, not an input
    expect(getByText(mockUser.email)).toBeInTheDocument();
  });

  test("renders save button", () => {
    const { getByRole } = render(<ProfileForm user={mockUser} />, { wrapper: createWrapper() });
    
    expect(getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});

describe("ChangePasswordForm Component", () => {
  test("renders password change form fields", () => {
    const { getByLabelText } = render(<ChangePasswordForm />, { wrapper: createWrapper() });
    
    expect(getByLabelText(/current password/i)).toBeInTheDocument();
    expect(getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(getByLabelText(/confirm.*password/i)).toBeInTheDocument();
  });

  test("renders change password button", () => {
    const { getByRole } = render(<ChangePasswordForm />, { wrapper: createWrapper() });
    
    expect(getByRole("button", { name: /change password/i })).toBeInTheDocument();
  });

  test("password fields are of type password", () => {
    const { getByLabelText } = render(<ChangePasswordForm />, { wrapper: createWrapper() });
    
    const currentPassword = getByLabelText(/current password/i);
    const newPassword = getByLabelText(/^new password$/i);
    const confirmPassword = getByLabelText(/confirm.*password/i);
    
    expect(currentPassword).toHaveAttribute("type", "password");
    expect(newPassword).toHaveAttribute("type", "password");
    expect(confirmPassword).toHaveAttribute("type", "password");
  });
});
