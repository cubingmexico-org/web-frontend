import NextAuth from "next-auth";
import "next-auth/jwt";
import type { NextAuthConfig, NextAuthResult } from "next-auth";

interface WCAProfile {
  me: {
    id: string;
    wca_id: string;
    name: string;
    avatar: {
      url: string;
      thumb_url: string;
      pending_url: string;
    };
  };
}

export const config = {
  providers: [
    {
      id: "wca",
      name: "WCA",
      type: "oauth",
      authorization: {
        url: "https://www.worldcubeassociation.org/oauth/authorize",
        params: { scope: "public manage_competitions" },
      },
      token: "https://www.worldcubeassociation.org/oauth/token",
      userinfo: "https://www.worldcubeassociation.org/api/v0/me",
      profile(profile: WCAProfile) {
        return {
          id: profile.me.wca_id,
          name: profile.me.name,
          email: null,
          image: profile.me.avatar.url
            ? profile.me.avatar.thumb_url
            : profile.me.avatar.pending_url,
        };
      },
      clientId: process.env.WCA_CLIENT_ID,
      clientSecret: process.env.WCA_CLIENT_SECRET,
    },
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = nextUrl;

      if (pathname.startsWith("/competidores.jpg")) {
        return true;
      }

      if (!isLoggedIn && pathname !== "/sign-in") {
        return Response.redirect(new URL("/sign-in", nextUrl));
      }

      if (isLoggedIn && pathname === "/sign-in") {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.token = token.access_token as string;

      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} as NextAuthConfig;

const result = NextAuth(config);

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;

declare module "next-auth" {
  interface Session {
    token?: string;
    /**
     * By default, TypeScript merges new interface properties and overwrites existing ones.
     * In this case, the default session user properties will be overwritten,
     * with the new ones defined above. To keep the default session user properties,
     * you need to add them back into the newly declared interface.
     */
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     token?: string
//   }
// }
