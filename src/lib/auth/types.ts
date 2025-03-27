// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    fullName: string;
    username: string;
    token: string;
    roles: string[];
    employeeId?: number;
    clientId?: number;
  }
  

  interface Session {
    user: {
      id: number;
      username: string;
      token: string;
      roles: string[];
      fullName: string;
      employeeId?: number;
      clientId?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number; 
    username: string;
    token: string;
    roles: string[];
    fullName: string;
    employeeId?: number;
    clientId?: number;
  }
  
}
