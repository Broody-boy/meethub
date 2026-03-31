import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
  }
}