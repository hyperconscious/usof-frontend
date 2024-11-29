export interface User {
  id: number;
  login: string;
  password: string;
  full_name: string;
  email: string;
  verified: boolean;
  avatar: string;
  publisherRating: number;
  commentatorRating: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}
