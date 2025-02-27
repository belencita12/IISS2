// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username: string;
    token: string;
    roles: string[];
  }

  interface Session {
    user: {
      username: string;
      token: string;
      roles: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    token: string;
    roles: string[];
  }
}
