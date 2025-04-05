export interface IUserProfile {
  id: number;
  fullName: string;
  username: string;
  adress: string;
  phoneNumber: string;
  ruc: string;
  email: string;
  roles: string[];
  image: {
    id: number;
    previewUrl: string;
    originalUrl: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: Record<string, never> | null;
}

export interface FormClient {
  id?: number;
  fullName: string;
  adress?: string; 
  phoneNumber: string;
  ruc: string;
  email: string;
}


