import { User } from './user';
import { Category } from './category';

export enum PostStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
}

export interface Post {
  id: number;
  author: User;
  title: string;
  publishDate: string;
  updatedDate: string;
  status: PostStatus;
  content: string;
  images: string[];
  categories: Category[];
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
}
