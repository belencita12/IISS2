// src/lib/auth/options.ts

import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { SigninResponse } from "./signin-response.type";

const HARDCODED_LOGIN_URL = "https://actual-maribeth-fiuni-9898c42e.koyeb.app/auth/signin"; //Hardcodeado por ahora

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
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
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        // Llamada directa a tu API con el endpoint hardcodeado
        const response = await fetch(HARDCODED_LOGIN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        // Si la respuesta no es OK, NextAuth lanza un error
        if (!response.ok) {
          throw new Error("Username or password is incorrect");
        }

        // Extrae la información del usuario
        const user = await response.json() as SigninResponse;
        if (!user) {
          throw new Error("Username or password is incorrect");
        }
        return {
          id: user.username, // o cualquier identificador único
          username: user.username,
          token: user.token,
          roles: user.roles,
        };

        return user;
      },
    }),
  ],
  // Se usará JWT para almacenar el estado de la sesión
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        //session.user. = token.id as string;
        session.user.username = token.username;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  // Páginas personalizadas para redirecciones
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
};

export default authOptions;
