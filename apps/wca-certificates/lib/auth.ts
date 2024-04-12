import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'wca',
      name: 'WCA',
      type: 'oauth',
      authorization: {
        url: 'https://www.worldcubeassociation.org/oauth/authorize',
        params: { scope: "public manage_competitions" },
      },
      token: "https://www.worldcubeassociation.org/oauth/token",
      userinfo: "https://www.worldcubeassociation.org/api/v0/me",
      profile(profile, tokens) {
        return {
          id: profile.me.id,
          name: profile.me.name,
          email: null,
          image: profile.me.avatar.url ? profile.me.avatar.thumb_url : profile.me.avatar.pending_url
        }
      },
      clientId: process.env.WCA_CLIENT_ID,
      clientSecret: process.env.WCA_CLIENT_SECRET
    }
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return '/certificates'
    },
    async session({ session, token, user }) {
      session.token = token.access_token

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token
    }
  }
}