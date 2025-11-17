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
    maxAge: 60 * 60 * 1, // 1 hour
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
    jwt({ token, account, profile }) {
      if (account) {
        token.access_token = account.access_token;
      }
      if (profile) {
        const wcaProfile = profile as unknown as WCAProfile;
        token.wca_id = wcaProfile.me.wca_id;
      }

      return token;
    },
    async session({ session, token }) {
      session.token = token.access_token as string;
      if (session.user) {
        session.user.id = token.wca_id as string;
      }

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
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    wca_id?: string;
    access_token?: string;
  }
}
