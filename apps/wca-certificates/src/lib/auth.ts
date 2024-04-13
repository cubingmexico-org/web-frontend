import type { NextAuthOptions } from 'next-auth';

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
      profile(profile: { me: { id: string, name: string, avatar: { url: string, thumb_url: string, pending_url: string } } }) {
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
    redirect() {
      return '/certificates'
    },
    session({ session, token }) {
      session.token = token.access_token

      return session;
    },
    jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token
    }
  }
}