// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username: string;
    token: string;
    roles: string[];
    fullname: string; 
  }
  

  interface Session {
    user: {
      id?: string;
      username: string;
      token: string;
      roles: string[];
      fullname: string; // Agregado aquí
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username: string;
    token: string;
    roles: string[];
    fullname: string; // Agregado aquí
  }
  
}
