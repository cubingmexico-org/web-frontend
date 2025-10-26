import NextAuth, { type NextAuthResult } from "next-auth";

interface WCAProfile {
  me: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    wca_id: string;
    gender: string;
    country_iso2: string;
    url: string;
    country: {
      id: string;
      name: string;
      continentId: string;
      iso2: string;
    };
    delegate_status: string | null;
    // teams: any[];
    avatar: {
      id: number;
      status: string;
      thumbnail_crop_x: null;
      thumbnail_crop_y: null;
      thumbnail_crop_w: null;
      thumbnail_crop_h: null;
      url: string;
      thumb_url: string;
      is_default: boolean;
      can_edit_thumbnail: boolean;
    };
  };
}

const result = NextAuth({
  providers: [
    {
      id: "wca",
      name: "World Cube Association",
      type: "oauth",
      issuer: "https://www.worldcubeassociation.org",
      authorization: {
        url: "https://www.worldcubeassociation.org/oauth/authorize",
        params: { scope: "openid public manage_competitions" },
      },
      token: "https://www.worldcubeassociation.org/oauth/token",
      userinfo: "https://www.worldcubeassociation.org/api/v0/me",
      profile(profile: WCAProfile) {
        return {
          id: profile.me.wca_id,
          name: profile.me.name,
          email: undefined,
          image: profile.me.avatar.thumb_url ?? undefined,
        };
      },
      clientId: process.env.WCA_CLIENT_ID,
      clientSecret: process.env.WCA_CLIENT_SECRET,
    },
  ],
  // debug: process.env.NODE_ENV !== "production",
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    jwt({ token, user, profile }) {
      if (profile) {
        token.id = (profile?.me as { wca_id: string }).wca_id;
      } else if (user) {
        token.id = user.id;
      }

      return token;
    },
    authorized: () => {
      return true;
    },
  },
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
