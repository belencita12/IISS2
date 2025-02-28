// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    token: string;
    roles: string[];
  }

  interface Session {
    user: {
      id: number;
      username: string;
      token: string;
      roles: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    token: string;
    roles: string[];
  }
}
