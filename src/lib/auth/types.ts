// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    fullname: string;
    username: string;
    token: string;
    roles: string[];
    fullname: string; 
  }
  

  interface Session {
    user: {
      username: string;
      token: string;
      roles: string[];
      fullname: string; // Agregado aquí
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    token: string;
    roles: string[];
    fullname: string; // Agregado aquí
  }
  
}
