export interface IUserProfile {
  id: number;
  fullName: string;
  username: string;
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
