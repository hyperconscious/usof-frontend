import { Post } from "./post";
import { User } from "./user";

export enum CommentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Comment {
  id: number;
  author: User;
  publishDate: Date;
  likesCount: number,
  dislikesCount: number,
  content: string;
  status: CommentStatus;
  post: Post;
}