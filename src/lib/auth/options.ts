// src/lib/auth/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { SigninResponse } from "./signin-response.type";
import { AUTH_API } from "@/lib/urls";


const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const response = await fetch(`${AUTH_API}/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Username or password is incorrect");
        }

        const user = await response.json() as SigninResponse;
        if (!user) {
          throw new Error("Username or password is incorrect");
        }
        return {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          token: user.token,
          roles: user.roles,
          employeeId: user.employeeId,
          clientId: user.clientId,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.fullName = user.fullName;
        token.id = user.id as number;
        token.username = user.username;
        token.token = user.token;
        token.roles = user.roles;
        token.employeeId = user.employeeId as number;
        token.clientId = user.clientId as number;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.token = token.token;
        session.user.roles = token.roles;
        session.user.fullName = token.fullName;
        session.user.employeeId = token.employeeId;
        session.user.clientId = token.clientId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
};

export default authOptions;