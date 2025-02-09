import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db/schema";

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
    },
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
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
        };
      },
      clientId: process.env.WCA_CLIENT_ID,
      clientSecret: process.env.WCA_CLIENT_SECRET,
    },
  ],
  debug: process.env.NODE_ENV !== "production",
});
