export interface IUserProfile {
    id: number;
    fullName: string;
    username: string;
    email: string;
    imageId: number | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    roles: string[];
  }
  