import { createAuthClient } from "better-auth/react";

const { signUp, signIn } = createAuthClient();

export { signUp, signIn };
