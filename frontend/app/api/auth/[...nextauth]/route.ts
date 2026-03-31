import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions : NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      // Run only on first login
      if (account?.id_token) { //account && !token.backendToken
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/oauth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: account.provider,
              idToken: account.id_token
              // accessToken: account.access_token, (for github)
            }),
          });

          if (!res.ok) {
            throw new Error("Backend auth failed");
          }

          const data = await res.json();

          token.backendToken = data.token;
        } catch (err) {
          console.error("JWT exchange error:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
