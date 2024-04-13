// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars -- This file is a placeholder for types
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    token?: unknown;
  }
}